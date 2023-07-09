import { Property } from "./PropertiesComponent";
import { Entity } from "@ash.ts/ash";

export interface IGadgetEvents {
    'gadgetEvent': [Entity, ...any],
    'gadgetPropertyEvent': [Entity, Property],
    'writeGadgetProperty': [Entity, string, string | number | boolean],
}

export type GadgetEventsT = keyof IGadgetEvents;
export type GadgetEventsArgsT<T extends GadgetEventsT> = IGadgetEvents[T];
export class EventsComponent extends Array<string | Property>{

}