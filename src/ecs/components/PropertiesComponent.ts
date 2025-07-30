import { HomeEngine } from '../HomeEngine';
import EventEmitter from 'eventemitter3';
import { type Gadget } from '../Gadget';

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
    /** the number of milliseconds elapsed since midnight, January 1, 1970 UTC */
    date,
}

export type ValuePropertyT<T extends PropertyDataType> = T extends PropertyDataType.boolean ? boolean :
    T extends PropertyDataType.float ? number :
        T extends PropertyDataType.int ? number :
            T extends PropertyDataType.string ? string :
                T extends PropertyDataType.json ? string :
                    T extends PropertyDataType.object ? object :
                        T extends PropertyDataType.date ? number :
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

const defaultWriteSetter = function(_oldValue: any, newValue: any){return Promise.resolve(newValue);};

export class Property<T extends PropertyDataType> extends EventEmitter <{write: (property: Property<any>)=>void;}>{
    description?: string;

    readonly id: string;

    readonly accessMode: PropertyAccessMode;

    min?: number;

    max?: number;

    private _value: ValuePropertyT<T>;

    enumData?: Record<string, ValuePropertyT<T>>;

    dataType: T;

    units?: string;

    $propertySetter = defaultWriteSetter;

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
        super();
        this.value = opt.value;
        this.dataType = opt.dataType;
        this.id = opt.id;
        this.accessMode = opt.accessMode;
        this.min = opt.min;
        this.max = opt.max;
        this.units = opt.units;
        if (opt.enumData) this.enumData = JSON.parse(JSON.stringify(opt.enumData));
    }

    get value(){
        return this._value;
    }

    set value(value: ValuePropertyT<T>){
        const oldVal = this._value;
        this.$propertySetter(this._value, value).catch((error)=>{
            console.error(error);
            this._value = oldVal;
        }).then(()=>this.emit('write', this));
        this._value = value;
    }
}

export class PropertiesComponent extends Map<string, Property<any>> {

    homeEngine?: HomeEngine;

    constructor(private entity: Gadget){
        super();

    }

    override set(key: string, value: Property<any>): this {
        if(this.has(key)){
            this.get(key)?.removeAllListeners('write');
        }
        value.on('write', this.onWrite, this);
        return super.set(key, value);
    }

    override delete(key: string): boolean {
        const prop = this.get(key);
        if(prop){
            prop.removeAllListeners('write');
        }
        return super.delete(key);
    }

    override get<T extends PropertyDataType = any>(key: string): Property<T> | undefined {
        return super.get(key);
    }
    
    createPropertyFromJson<T extends PropertyDataType = PropertyDataType.any>(json: IProperty): Property<T> {
        const isAccessModeUndefined = json.accessMode === undefined || json.accessMode === null;
        if (!json.id || isAccessModeUndefined) {
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

    /** @deprecated */
    getTyped<T extends PropertyDataType>(id: string): Property<T> | undefined {
        return this.get(id) as Property<T> | undefined;
    }

    private onWrite<T extends PropertyDataType>(property: Property<T>){
        this.homeEngine?.emit('gadgetPropertyEvent', this.entity, property);
        this.entity.emit('propertyWrite', property, this.entity);
    };
}
