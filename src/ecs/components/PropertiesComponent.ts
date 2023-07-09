export enum PropertyAccessMode {
    none = 0,
    read = 0b0001,
    write = 0b0010,
    rw = 0b0011,
    notify = 0b0100,
    rwn = 0b0111,
    rn = 0b0101,
}

export interface IProperty {
    id: string;
    accessMode: PropertyAccessMode | number;
    value: string | number | boolean;
    min?: number;
    max?: number;
    description?: string;
}

export class Property<T extends string | number | boolean = string | number | boolean> {
    description?: string;

    constructor(
        public readonly id: string,
        public readonly accessMode: PropertyAccessMode | number,
        public value: T | null = null,
        public min?: number,
        public max?: number,
    ) {
    }
}

export class PropertiesComponent extends Map<string, Property<any>> {
    createPropertyFromJson(json: IProperty) {
        if (!json.id || !json.accessMode) {
            throw new Error('try convert broken json to gadget property\n' + JSON.stringify(json));
        }
        this.set(json.id, new Property(
            json.id,
            json.accessMode,
            json.value,
            json.min,
            json.max
        ));
    }

    getTyped<T extends string | number | boolean>(string) {
        return this.get(string) as Property<T> | undefined;
    }
}