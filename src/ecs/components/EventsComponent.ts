import { uuidT } from "root/src/exportedTypes/common";

export type GadgetEventArgsT = ['gadgetEvent', uuidT, ...any];
export type GadgetEventCbT = (uuid: uuidT, ...args: any[])=>void;

export class EventsComponent extends Array{

}