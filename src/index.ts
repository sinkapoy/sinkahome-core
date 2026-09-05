// init base services
import { FileProviderSystem } from './ecs/systems/FileProviderSystem';
import { homeEngine, type HomeEngine } from 'src/ecs/HomeEngine';
import { serviceLocator } from './serviceLocator';
import { getFileSystemProvider } from './utils/fileProviders';
import { GlobalConfigService } from './services/GlobalConfigService';
import { ServerUsersService } from './services/users/ServerUsersSystem';
import { EventsSystem } from './ecs/systems/EventsSystem';


// export core features

export * from 'src/ecs';
export { serviceLocator } from './serviceLocator';
export { type IService, ServiceLocator } from './utils/ServiceLocator';
export * from 'src/ecs/components/export';
export * from 'src/utils/ArrayMap';
export * from 'src/utils/common';
export * from 'src/services/users/ServerUsersSystem';

serviceLocator().set('files', getFileSystemProvider());
serviceLocator().set('config', new GlobalConfigService());
serviceLocator().set('users', new ServerUsersService());

homeEngine.addSystem(new FileProviderSystem(), 0);
homeEngine.addSystem(new EventsSystem, Number.MAX_SAFE_INTEGER);

export type HomeEngineT<T> = HomeEngine<T>;
