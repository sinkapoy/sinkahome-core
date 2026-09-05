import { Engine, Signal2, type Entity, type NodeList } from '@ash.ts/ash';
import { ArrayMap } from '../utils/ArrayMap';
import { type HomeSystem } from './HomeSystem';
import { HomeEvent } from './HomeEvent';
import { type uuidT, type IHomeCoreEvents } from '../exportedTypes/common';
import { GadgetNode } from './nodes/common';
import type { Property } from './components/PropertiesComponent';

interface IGadgetSignals {
    propChanged: Signal2<Entity, Property<any>>;
}

export class HomeEngine<EventsT = Record<string, any[]> & IHomeCoreEvents> extends Engine {
    private readonly eventMaps = new Map<string | number | symbol, Array<HomeSystem<any>>>();

    private readonly nextTickCbs: Array<() => void | Promise<void>> = [];

    private readonly eventsToEmit = new ArrayMap<string | number | symbol, HomeEvent[]>();

    protected gadgets: NodeList<GadgetNode>;

    protected events = new Map<uuidT, IGadgetSignals>();

    constructor () {
        super();

        this.gadgets = this.getNodeList(GadgetNode);
    }

    emit<T extends keyof EventsT>
    // @ts-expect-error force rest arg
    (event: T, ...args: (EventsT)[T]): void {
        // @ts-expect-error force rest arg
        const eventObj = new HomeEvent(event, ...args);
        // console.log('emit', event, args)
        this.eventsToEmit.get(event).push(eventObj);
    }

    on<T extends string = string>(event: T, system: HomeSystem<any>): void {
        this.getEventMapArray(event).push(system);
    }

    off<T extends string = string>(event: T, system?: HomeSystem<any>): void {
        if (!system) {
            this.eventMaps.delete(event);
        }
        if (this.eventMaps.has(event)) {
            this.eventMaps.set(
                event,
                this.getEventMapArray(event).filter(
                    (s) => s !== system,
                ),
            );
        }
    }

    private getEventMapArray (event: string | number | symbol): Array<HomeSystem<any>> {
        let array = this.eventMaps.get(event);
        if (!array) {
            array = [] as Array<HomeSystem<any>>;
            this.eventMaps.set(event, array);
        }
        return array;
    }

    nextUpdate (cb: () => void | Promise<void>): void {
        this.nextTickCbs.push(cb);
    }

    update (dt: number): void {
        // tick callbacks
        if (this.nextTickCbs.length > 0) {
            for (let i = 0; i < this.nextTickCbs.length; i++) {
                this.nextTickCbs[i]();
            }
            this.nextTickCbs.splice(0);
        }
        // props processing
        let head  = this.gadgets.head;
        while(head){
            for(const prop of head.properties.values()){
                if(prop.changed){
                    prop.changed = false;
                    if (this.events.has(head.entity.name)){
                        this.events.get(head.entity.name)!.propChanged.dispatch(head.entity, prop);
                    }
                }
            }
            head = head.next;
        }
        // events processing
        for (const entry of this.eventsToEmit.entries()) {
            const eventName = entry[0];
            const events = entry[1];
            if (!this.eventMaps.has(eventName)) continue;

            const systems = this.eventMaps.get(eventName)!;
            for (let s = 0; s < systems.length; s++) {
                const system = systems[s];
                for (let e = 0; e < events.length; e++) {
                    system.processEmitedEvent(events[e]);
                }
            }
        }
        this.eventsToEmit.clear();
        // systems update
        this.updating = true;
        // @ts-expect-error read private field systemList
        for (let system: System | null = this.systemList.head; system; system = system.next) {
            try {
                system.update(dt);
            } catch (e) {
                console.error(e);
            }
        }
        this.updating = false;
        this.updateComplete.dispatch();
    }

    /**
     * @description
     * do search by uuid
     * @yields
     * eval time O(log(n))
     * @param uuid
     * @returns
     */
    getByUUID (uuid: uuidT) {
        return super.getEntityByName(uuid) as Entity | undefined;
    }

    /**
     * @description
     * do search by 'user-name' property
     * @yields
     * eval time O(n)
     * @param name
     * @returns
     */
    getByUserName (name: string) {
        const result: Entity[] = [];
        let gadget = this.gadgets.head;
        while (gadget) {
            const val = gadget.properties.get('user-name')?.value;
            if (val === name) {
                result.push(val);
            }
            gadget = gadget.next;
        }

        return result;
    }


    onGadgetPropertyEvent(gadget: uuidT, callback: (entity: Entity, prop: Property<any>)=>void){
        if(!this.events.has(gadget)){
            this.events.set(gadget, {
                propChanged: new Signal2(),
            });
        }
        this.events.get(gadget)!.propChanged.add(callback);
    }

    offGadgetPropertyEvent(gadget: uuidT, callback?: (...args: any)=>void){
        if(this.events.has(gadget)){
            const signal = this.events.get(gadget)!.propChanged;
            if(callback){
                signal.remove(callback);
            } else {
                signal.removeAll();
            }
        }
    }
}

export const homeEngine = new HomeEngine<IHomeCoreEvents & {[key: string]: any[];}>();