import { Engine } from "@ash.ts/ash";
import { HomeSystem } from "./HomeSystem";
import { EventArgsT, HomeEvent } from "./HomeEvent";

export class HomeEngine extends Engine {
    private eventMaps = new Map<string, HomeSystem[]>();

    emit<T extends string = string, ArgsT extends EventArgsT<T> = EventArgsT<T>>
        (event: T, ...args: ArgsT) {
        if (!this.eventMaps.has(event)) return;
        const systems = this.getEventMapArray(event);
        const eventObj = new HomeEvent(event, ...args);
        for(let i = 0; i < systems.length; i++){
            systems[i].processEmitedEvent(eventObj);
        }
    }

    on<T extends string = string>(event: T, system: HomeSystem) {
        this.getEventMapArray(event).push(system);
    }

    off<T extends string = string>(event: T, system?: HomeSystem) {
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

    private getEventMapArray(event: string): HomeSystem[] {
        let array = this.eventMaps.get(event);
        if (!array) {
            array = [] as HomeSystem[];
            this.eventMaps.set(event, array);
        }
        return array;
    }
}