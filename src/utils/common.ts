import { Entity, type Node, type NodeList } from '@ash.ts/ash';
import { LogComponent } from 'src/ecs/components/LogComponent';
import type { uuidT } from '../exportedTypes/common';
import { PropertiesComponent } from '../ecs/components/PropertiesComponent';
import { ActionsComponent } from '../ecs/components/ActionsComponent';
import { EventsComponent } from '../ecs/components/EventsComponent';
import { GadgetComponent } from '../ecs/components/GadgetComponent';

export enum VmType {
    NODE,
    BROWSER,
}

export function foreachNode<T extends Node> (list: NodeList<T>, cb: (node: T) => void): void {
    let node = list.head;
    while (node) {
        cb(node);
        node = node.next;
    }
}

export function createGadget (uuid: uuidT, own: boolean): Entity {
    const entity = new Entity(uuid);
    entity
        .add(new GadgetComponent(uuid, own))
        .add(new PropertiesComponent())
        .add(new ActionsComponent())
        .add(new EventsComponent());

    return entity;
}

export function createLog (name: uuidT): Entity {
    const entity = new Entity(`log:${name}`);
    entity
        .add(LogComponent);
    return entity;
}

export function checkVM (): VmType {
    if (!globalThis.window) {
        return VmType.NODE;
    }
    return VmType.BROWSER;
}

export function uniqueArray<T> (array: T[]): T[] {
    return array.filter((element, index) => array.indexOf(element) === index);
}
