import { HomeEngine } from 'src/ecs/HomeEngine';
import type { IGadgetEvents } from '../ecs/components/EventsComponent';
import type { IFileEvents } from '../ecs/systems/FileProviderSystem';

export type uuidT = string;

export interface IHomeCoreEvents extends
    IGadgetEvents,
    IFileEvents { };