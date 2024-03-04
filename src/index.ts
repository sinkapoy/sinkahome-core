// init base services
import { HomeEngine } from './ecs/HomeEngine';
import { type IHomeCoreEvents } from './exportedTypes/common';
import { serviceLocator } from './serviceLocator';
import { getFileSystemProvider } from './utils/fileProviders';
import { GlobalConfigService } from './services/GlobalConfigService';

// export core features
export { HomeSystem } from './ecs/HomeSystem';
export { serviceLocator } from './serviceLocator';
export { type IService, ServiceLocator } from './utils/ServiceLocator';

export * from './ecs/components/export';
export * from './ecs/nodes/common';
export * from './ecs/nodes/LogNode';
export * from './utils/ArrayMap';
export * from './utils/common';

serviceLocator().set('files', getFileSystemProvider());
serviceLocator().set('config', new GlobalConfigService());

export const homeEngine = new HomeEngine<Record<string, any[]> & IHomeCoreEvents>();
export type HomeEngineT<T> = HomeEngine<T>;
