// init base services
import './utils/fileProviders';
import { HomeEngine } from './ecs/HomeEngine';
import { type IHomeCoreEvents } from './exportedTypes/common';

// export core features
export { HomeSystem } from './ecs/HomeSystem';
export { serviceLocator } from './serviceLocator';
export { type IService, ServiceLocator } from './utils/ServiceLocator';

export * from './ecs/components/export';
export * from './ecs/nodes/common';
export * from './ecs/nodes/LogNode';
export * from './utils/ArrayMap';
export * from './utils/common';

export const homeEngine = new HomeEngine<Record<string, any[]> & IHomeCoreEvents>();
export type HomeEngineT<T> = HomeEngine<T>;
