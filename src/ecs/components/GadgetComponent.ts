import { uuidT } from "@root/src/exportedTypes/common";

export class GadgetComponent {
    constructor(
        /** unique string */
        public readonly uuid: uuidT,
        public readonly own: boolean,
        ) { }
}