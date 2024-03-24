export enum PropertyAccessMode {
    none = 0,
    read = 0b0001,
    write = 0b0010,
    rw = 0b0011,
    notify = 0b0100,
    rwn = 0b0111,
    rn = 0b0101,
}

export enum PropertyDataType {
    any,
    /** integer number (all types like uint8-64 int8-64) */
    int,
    /** float point number */
    float,
    /** string */
    string,
    /** boolean */
    boolean,
    /** use for Array and Record<any, any> and null types */
    object,
    /** serialized json object (string which can be converted to js object) */
    json,
}

export type ValuePropertyT<T extends PropertyDataType> = T extends PropertyDataType.boolean ? boolean :
    T extends PropertyDataType.float ? number :
        T extends PropertyDataType.int ? number :
            T extends PropertyDataType.string ? string :
                T extends PropertyDataType.json ? string :
                    T extends PropertyDataType.object ? object :
                        any;

export interface IProperty {
    id: string;
    accessMode: PropertyAccessMode | number;
    value: string | number | boolean | any[] | object;
    min?: number;
    max?: number;
    enumData?: Record<string, any>;
    description?: string;
    dataType?: PropertyDataType;
    units?: string;
}

export class Property<T extends PropertyDataType> {
    description?: string;

    readonly id: string;

    readonly accessMode: PropertyAccessMode;

    min?: number;

    max?: number;

    value: ValuePropertyT<T>;

    enumData?: Record<string, ValuePropertyT<T>>;

    dataType: T;

    units?: string;

    constructor (opt: {
        id: string;
        accessMode: PropertyAccessMode;
        min?: number;
        max?: number;
        dataType: T;
        value: ValuePropertyT<T>;
        units?: string;
        enumData?: Record<string, ValuePropertyT<T>>;
    }) {
        this.value = opt.value;
        this.dataType = opt.dataType;
        this.id = opt.id;
        this.accessMode = opt.accessMode;
        this.min = opt.min;
        this.max = opt.max;
        this.units = opt.units;
        if (opt.enumData) this.enumData = JSON.parse(JSON.stringify(opt.enumData));
    }
}

export class PropertiesComponent extends Map<string, Property<any>> {
    createPropertyFromJson<T extends PropertyDataType = PropertyDataType.any>(json: IProperty): Property<T> {
        const isAccessMode = json.accessMode === undefined || json.accessMode === null;
        if (!json.id || isAccessMode) {
            throw new Error(`try convert broken json to gadget property\n${JSON.stringify(json)}`);
        }

        let { dataType } = json;
        if (!dataType) {
            switch (typeof json.value) {
                    case 'boolean':
                        dataType = PropertyDataType.boolean;
                        break;
                    case 'number':
                        dataType = PropertyDataType.float;
                        break;
                    case 'string':
                        try {
                            JSON.parse(json.value);
                            dataType = PropertyDataType.json;
                        } catch {
                            dataType = PropertyDataType.string;
                        }
                        break;
                    case 'object':
                        dataType = PropertyDataType.object;
                        break;
                    default:
                        dataType = PropertyDataType.any;
            }
        }

        const property = new Property(
            {
                ...json,
                dataType,
            },
        );
        this.set(json.id, property);
        return property as Property<T>;
    }

    add (property: Property<any>): void {
        this.set(property.id, property);
    }

    getTyped<T extends PropertyDataType>(id: string): Property<T> | undefined {
        return this.get(id) as Property<T> | undefined;
    }
}
