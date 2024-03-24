import { defineNode } from '@ash.ts/ash';
import { GadgetComponent } from '../components/GadgetComponent';
import { PropertiesComponent } from '../components/PropertiesComponent';
import { EventsComponent } from '../components/EventsComponent';
import { ActionsComponent } from '../components/ActionsComponent';

export class PropertyGadgetNode extends defineNode({
    data: GadgetComponent,
    properties: PropertiesComponent,
}) { }

export class EventsGadgetNode extends defineNode({
    data: GadgetComponent,
    events: EventsComponent,
}) { }

export class ActionsGadgetNode extends defineNode({
    data: GadgetComponent,
    actions: ActionsComponent,
}) { }

export class GadgetNode extends defineNode({
    data: GadgetComponent,
    actions: ActionsComponent,
    events: EventsComponent,
    properties: PropertiesComponent,
}) { }
