import { Entity } from '@ash.ts/ash';
import { uuidT } from 'src/exportedTypes/common';
import { IProperty, PropertiesComponent } from './components/PropertiesComponent';
import { GadgetComponent } from './components/GadgetComponent';
import { ActionsComponent } from './components/ActionsComponent';
import { EventsComponent } from './components/EventsComponent';
import EventEmitter from 'eventemitter3';

interface IGadgetClassEvents {
    propertyWrite: (property: IProperty, entity: Gadget)=>void;
}

export class Gadget extends Entity {

    protected events = new EventEmitter<IGadgetClassEvents>();

    constructor(uuid: uuidT, own: boolean = true){
        super(uuid);
        const properties = new PropertiesComponent(this);
        this
            .add(new GadgetComponent(uuid, own))
            .add(properties)
            .add(new ActionsComponent())
            .add(new EventsComponent());
    }

    emit<T extends keyof IGadgetClassEvents>(key: T, ...args: EventEmitter.ArgumentMap<IGadgetClassEvents>[T]){
        return this.events.emit(key, ...args);
    }

    on<T extends keyof IGadgetClassEvents>(key: T, cb:IGadgetClassEvents[T], context?: any){
        return this.events.on(key, cb, context);
    }

    off<T extends keyof IGadgetClassEvents>(key: T, cb:IGadgetClassEvents[T], context?: any){
        return this.events.off(key, cb, context);
    }
}