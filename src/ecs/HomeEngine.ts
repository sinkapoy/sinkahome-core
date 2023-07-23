import { Engine } from "@ash.ts/ash";
import { HomeSystem } from "./HomeSystem";
import { HomeEvent } from "./HomeEvent";
import { IHomeCoreEvents } from "../exportedTypes/common";
import { FileProviderSystem } from "@root/src/ecs/systems/FileProviderSystem";
import { ArrayMap } from "@root/src/utils/ArrayMap";

export class HomeEngine<EventsT = Record<string, any[]> & IHomeCoreEvents> extends Engine {
    private eventMaps = new Map<string | number | symbol, HomeSystem<any>[]>();
    private nextTickCbs: (() => void | Promise<void>)[] = [];
    private eventsToEmit = new ArrayMap<string | number | symbol, HomeEvent[]>();

    constructor() {
        super();
        this.addSystem(new FileProviderSystem(), 0);
    }

    emit<T extends keyof EventsT>
        // @ts-ignore
        (event: T, ...args: (EventsT)[T]) {
        // @ts-ignore
        const eventObj = new HomeEvent(event, ...args);
        this.eventsToEmit.get(event).push(eventObj);
    }

    on<T extends string = string>(event: T, system: HomeSystem<any>) {
        this.getEventMapArray(event).push(system);
    }

    off<T extends string = string>(event: T, system?: HomeSystem<any>) {
        if (!system) {
            this.eventMaps.delete(event);
        }
        if (this.eventMaps.has(event)) {
            this.eventMaps.set(
                event,
                this.getEventMapArray(event).filter(
                    (s) => {
                        s !== system
                    }
                ));
        }
    }

    private getEventMapArray(event: string | number | symbol): HomeSystem<any>[] {
        let array = this.eventMaps.get(event);
        if (!array) {
            array = [] as HomeSystem<any>[];
            this.eventMaps.set(event, array);
        }
        return array;
    }

    nextUpdate(cb: () => void | Promise<void>) {
        this.nextTickCbs.push(cb);
    }

    update(dt: number): void {
        // tick callbacks
        if (this.nextTickCbs.length) {
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
        super.update(dt);
    }
}