import { Node, NodeClassType, NodeList, System } from "@ash.ts/ash";
import type { HomeEngine } from "./HomeEngine";
import { NodeClassT } from "@root/types/node";
import { EventArgsT, EventCbT, HomeEvent } from "./HomeEvent";
import { ArrayMap } from "../utils/ArrayMap";

export abstract class HomeSystem<EventsT extends string = string> extends System {
    protected engine!: HomeEngine;
    private lists: NodeList<any>[] = [];
    private listsUpdates = new Map<NodeList<any>, (node: Node, dt?: number) => void>();
    private incomeEvents: HomeEvent[] = [];
    private eventCallbacks = new ArrayMap<string, ((...args: any[]) => void)[]>();

    addToEngine(engine: HomeEngine): void {
        this.engine = engine;
        this.onInit();
    }

    removeFromEngine(engine: HomeEngine): void {
        this.onDestroy();
    }

    update(dt: number): void {
        this.eventsOnUpdate();
        this.lists.forEach(list=>{
            if(!this.listsUpdates.has(list)) return;
            const updates = this.listsUpdates.get(list)!;
            let node = list.head;
            while(node){
                updates(node, dt);
                node = node.next;
            }
        });
        this.onUpdate(dt);
    }

    private eventsOnUpdate() {
        for (let i = 0; i < this.incomeEvents.length; i++) {
            const event = this.incomeEvents[i];
            if (!this.eventCallbacks.has(event.name)) continue;
            const cbs = this.eventCallbacks.get(event.name);
            for (let cbi = 0; cbi < cbs.length; cbi++) {
                cbs[cbi](...event.args);
            }
        }
        this.incomeEvents.splice(0);
    }

    setupNodeList<T extends Node>(opt: {
        node: NodeClassType<T>;
        onAdd?: (node: T) => void;
        onRemove?: (node: T) => void;
        onUpdate?: (node: T, dt: number) => void;
    }) {
        const list = this.engine.getNodeList(opt.node);
        if (opt.onAdd) {
            list.nodeAdded.add(opt.onAdd);
        }
        if (opt.onRemove) {
            list.nodeRemoved.add(opt.onRemove);
        }
        if (opt.onUpdate) {
            // @ts-expect-error todo: types
            this.listsUpdates.set(list, opt.onUpdate);
        }
        this.lists.push(list);
        return list;
    }

    abstract onInit(): void;

    abstract onDestroy(): void;

    abstract onUpdate(dt: number): void;

    setupEvent<ArgsT extends EventArgsT<EventsT> = EventArgsT<EventsT>>
        (name: EventsT, cb: EventCbT<ArgsT>, once = false) {
        if (once) {
            throw new Error('not emplemented');
        } else {
            this.engine.on(name, this);
            const cbs = this.eventCallbacks.get(name);
            cbs.push(cb as EventCbT);
        }
    }

    processEmitedEvent(event: HomeEvent) {
        this.incomeEvents.push(event);
    }
}