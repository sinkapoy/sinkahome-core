import type { Node } from '@ash.ts/ash';

export declare type NodeClassT<T> = Node & {
    [P in keyof T]: new() => T[P];
};
