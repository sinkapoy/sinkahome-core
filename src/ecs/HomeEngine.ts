import { Engine } from "@ash.ts/ash";
import { HomeSystem } from "./HomeSystem";
import { HomeEvent } from "./HomeEvent";
import { IHomeCoreEvents } from "../exportedTypes/common";
import { FileProviderSystem } from "@root/src/ecs/systems/FileProviderSystem";

export class HomeEngine<EventsT = Record<string, []>> extends Engine {
    private eventMaps = new Map<string | number | symbol, HomeSystem<any>[]>();

    constructor(){
        super();
        this.addSystem(new FileProviderSystem(), 0);
    }

    emit
        // @ts-ignore
        (event: keyof (EventsT & IHomeCoreEvents), ...args: (EventsT&IHomeCoreEvents)[typeof event]) {
        if (!this.eventMaps.has(event)) return;
        const systems = this.getEventMapArray(event);
        // @ts-ignore
        const eventObj = new HomeEvent(event, ...args);
        for (let i = 0; i < systems.length; i++) {
            systems[i].processEmitedEvent(eventObj);
        }
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
}