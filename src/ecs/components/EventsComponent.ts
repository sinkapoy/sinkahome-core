import type { Entity } from '@ash.ts/ash';
import type { Property } from './PropertiesComponent';

export interface IGadgetEvents {
    'gadgetEvent': [Entity, ...any]
    'gadgetPropertyEvent': [Entity, Property<any>]
    'writeGadgetProperty': [entity: Entity, propId: string, value: string | number | boolean]
}

export type GadgetEventsT = keyof IGadgetEvents;
export type GadgetEventsArgsT<T extends GadgetEventsT> = IGadgetEvents[T];
export class EventsComponent extends Array<string | Property<any>> {

}
