import { Entity, Node, NodeList } from "@ash.ts/ash";
import type { uuidT } from "../exportedTypes/common";
import { PropertiesComponent } from "../ecs/components/PropertiesComponent";
import { ActionsComponent } from "../ecs/components/ActionsComponent";
import { EventsComponent } from "../ecs/components/EventsComponent";
import { GadgetComponent } from "../ecs/components/GadgetComponent";

export function foreachNode<T extends Node>(list: NodeList<T>, cb: (node: T) => void) {
    let node = list.head;
    while (node) {
        cb(node);
        node = node.next;
    }
}

export function createGadget(uuid: uuidT, own: boolean) {
    const entity = new Entity(uuid);
    entity
        .add(new GadgetComponent(uuid, own))
        .add(new PropertiesComponent())
        .add(new ActionsComponent())
        .add(new EventsComponent());

    return entity;
}

export enum VM_TYPE {
    nodejs,
    browser,
}

export function checkVM() {
    if (typeof window === 'undefined') {
        return VM_TYPE.nodejs;
    }
    return VM_TYPE.browser;
}

export function uniqueArray<T>(array: T[]) {
    return array.filter((element, index) => array.indexOf(element) === index);
}