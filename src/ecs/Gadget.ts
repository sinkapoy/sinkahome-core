import { Entity, Signal2 } from '@ash.ts/ash';
import { uuidT } from 'src/exportedTypes/common';
import { PropertiesComponent } from './components/PropertiesComponent';
import { GadgetComponent } from './components/GadgetComponent';
import { ActionsComponent } from './components/ActionsComponent';
import { EventsComponent } from './components/EventsComponent';

export class Gadget extends Entity {

    readonly propertiesChangedSignal: Signal2<Entity, string[]>;
    constructor(uuid: uuidT, own: boolean = true){
        super(uuid);
        const properties = new PropertiesComponent();
        this.propertiesChangedSignal = properties.changedSignal;
        this
            .add(new GadgetComponent(uuid, own))
            .add(properties)
            .add(new ActionsComponent())
            .add(new EventsComponent());
    }
}