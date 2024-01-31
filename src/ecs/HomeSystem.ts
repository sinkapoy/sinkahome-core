import {
    type Node, type NodeClassType, type NodeList, System
} from '@ash.ts/ash';
import type { HomeEngine } from './HomeEngine';
import { type EventCbT, type HomeEvent } from './HomeEvent';
import { ArrayMap } from '../utils/ArrayMap';
import { type IHomeCoreEvents } from '../exportedTypes/common';

export abstract class HomeSystem<T extends IHomeCoreEvents = IHomeCoreEvents> extends System {
    protected engine!: HomeEngine<T>;

    private readonly lists: Array<NodeList<any>> = [];

    private readonly listsUpdates = new Map<NodeList<any>, (node: Node, dt?: number) => void>();

    private readonly incomeEvents: HomeEvent[] = [];

    private readonly eventCallbacks = new ArrayMap<string | number | symbol, Array<(...args: any[]) => void>>();

    addToEngine (engine: HomeEngine<any>): void {
        this.engine = engine as HomeEngine<T>;
        this.onInit();
    }

    removeFromEngine (engine: HomeEngine): void {
        this.onDestroy();
    }

    update (dt: number): void {
        this.eventsOnUpdate();
        this.lists.forEach((list) => {
            if (!this.listsUpdates.has(list)) return;
            const updates = this.listsUpdates.get(list)!;
            let node: Node | null = list.head;
            while (node) {
                updates(node, dt);
                node = node.next;
            }
        });
        this.onUpdate(dt);
    }

    private eventsOnUpdate (): void {
        for (let i = 0; i < this.incomeEvents.length; i++) {
            const event = this.incomeEvents[i];
            if (!this.eventCallbacks.has(event.name)) continue;
            const cbs = this.eventCallbacks.get(event.name);
            for (let cbi = 0; cbi < cbs.length; cbi++) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                cbs[cbi](...event.args);
            }
        }
        this.incomeEvents.splice(0);
    }

    setupNodeList<T extends Node>(opt: {
        node: NodeClassType<T>
        onAdd?: (node: T) => void
        onRemove?: (node: T) => void
        onUpdate?: (node: T, dt: number) => void
    }): NodeList<T> {
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

    abstract onInit (): void;

    abstract onDestroy (): void;

    abstract onUpdate (dt: number): void;

    setupEvent<Type extends keyof T & string>(
        name: Type,
        cb: EventCbT<T[Type] & []>,
        once = false
    ): void {
        if (once) {
            throw new Error('once event subscription not emplemented');
        } else {
            this.engine.on(name, this);
            const cbs = this.eventCallbacks.get(name);
            cbs.push(cb as unknown as EventCbT);
        }
    }

    processEmitedEvent (event: HomeEvent): void {
        this.incomeEvents.push(event);
    }
}
