// init base services
import { FileProviderSystem } from './ecs/systems/FileProviderSystem';
import { homeEngine, type HomeEngine } from 'src/ecs/HomeEngine';
import { serviceLocator } from './serviceLocator';
import { getFileSystemProvider } from './utils/fileProviders';
import { GlobalConfigService } from './services/GlobalConfigService';
import { HomeInjectorSystem } from './ecs/systems/HomeInjectorSystem';


// export core features

export * from 'src/ecs';
export { serviceLocator } from './serviceLocator';
export { type IService, ServiceLocator } from './utils/ServiceLocator';
export * from 'src/ecs/components/export';
export * from 'src/utils/ArrayMap';

serviceLocator().set('files', getFileSystemProvider());
serviceLocator().set('config', new GlobalConfigService());

homeEngine.addSystem(new HomeInjectorSystem(), 0);
homeEngine.addSystem(new FileProviderSystem(), 0);


export const homeEngine = new HomeEngine<Record<string, any[]> & IHomeCoreEvents>();
export type HomeEngineT<T> = HomeEngine<T>;
