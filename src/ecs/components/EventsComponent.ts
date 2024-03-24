import type { Entity } from '@ash.ts/ash';
import type { Property, PropertyDataType } from './PropertiesComponent';

export interface IGadgetEvents {
    'gadgetEvent': [Entity, ...any];
    'gadgetPropertyEvent': [Entity, Property<any>];
    'writeGadgetProperty': [entity: Entity, propId: string, value: string | number | boolean];
    'invokeGadgetAction': [entity: Entity, actionId: string, ...args: any];
    'gadgetActonResult': [entity: Entity, actionId: string, result: any];
}

export type GadgetEventsT = keyof IGadgetEvents;
export type GadgetEventsArgsT<T extends GadgetEventsT> = IGadgetEvents[T];

export interface IGadgetEvent {
    id: string;
    args: Record<string, PropertyDataType>;
}

class Event implements IGadgetEvent {
    args: Record<string, PropertyDataType> = {};
    constructor (public readonly id: string) {

    }
}
export class EventsComponent extends Map<string, Event> {
    createFromJson (json: Partial<IGadgetEvent>): Event {
        if (!json.id) throw new Error('try to create event without id');
        const event = new Event(json.id);
        this.set(json.id, event);
        return event;
    }
}
