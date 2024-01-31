import { Engine } from '@ash.ts/ash';
import { FileProviderSystem } from './systems/FileProviderSystem';
import { ArrayMap } from '../utils/ArrayMap';
import { type HomeSystem } from './HomeSystem';
import { HomeEvent } from './HomeEvent';
import { type IHomeCoreEvents } from '../exportedTypes/common';
import { UsersSystem } from './systems/UsersSystem';

export class HomeEngine<EventsT = Record<string, any[]> & IHomeCoreEvents> extends Engine {
    private readonly eventMaps = new Map<string | number | symbol, Array<HomeSystem<any>>>();

    private readonly nextTickCbs: Array<() => void | Promise<void>> = [];

    private readonly eventsToEmit = new ArrayMap<string | number | symbol, HomeEvent[]>();

    constructor () {
        super();
        this.addSystem(new FileProviderSystem(), 0);
        this.addSystem(new UsersSystem(), 0);
    }

    emit<T extends keyof EventsT>
    // @ts-expect-error force rest arg
    (event: T, ...args: (EventsT)[T]): void {
        // @ts-expect-error force rest arg
        const eventObj = new HomeEvent(event, ...args);
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
                    (s) => s !== system
                )
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
}
