import { Node, NodeList } from "@ash.ts/ash";

export function foreachNode<T extends Node>(list: NodeList<T>, cb: (node: T) => void) {
    let node = list.head;
    while (node) {
        cb(node);
        node = node.next;
    }
}