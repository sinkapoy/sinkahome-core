export enum PropertyAccessMode {
    none = 0,
    read = 0b001,
    write = 0b010,
    rw = 0b011,
    notify = 0b100,
    rwn = 0b111,
}

export interface IProperty {
    id: string;
    accessMode: PropertyAccessMode | number;
    value: string | number | boolean;
    min?: number;
    max?: number;
    description?: string;
}

export class Property<T extends string | number | boolean = string> {
    description?: string;
    
    constructor(
        public readonly id: string,
        public readonly accessMode: PropertyAccessMode | number,
        public value: T | null = null,
        min?: number,
        max?: number,
    ) {
    }
}

export class PropertiesComponent extends Map<string, Property<any>> {
    createPropertyFromJson(json: IProperty){
        if(!json.id || !json.accessMode){
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

    getTyped<T extends string | number | boolean>(string){
        return this.get(string) as Property<T> | undefined;
    }
}