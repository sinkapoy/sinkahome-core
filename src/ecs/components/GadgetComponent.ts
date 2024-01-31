import { type uuidT } from '../../exportedTypes/common';

export class GadgetComponent {
    constructor (
        /** unique string */
        public readonly uuid: uuidT,
        public readonly own: boolean
    ) { }
}
