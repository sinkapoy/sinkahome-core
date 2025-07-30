import { type Node, type NodeList } from '@ash.ts/ash';
import type { uuidT } from '../exportedTypes/common';
import { Gadget } from 'src/ecs/Gadget';

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

/** 
 * @deprecated
 * use new Gadget() instead 
 */
export function createGadget (uuid: uuidT, own: boolean): Gadget {
    return new Gadget(uuid, own);
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
