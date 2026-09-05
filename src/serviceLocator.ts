import { type GlobalConfigService } from './services/GlobalConfigService';
import { type IUserService } from './services/users/IUserService';
import { ServiceLocator } from './utils/ServiceLocator';
import { type IFileProviderService } from './utils/fileProviders/IFileProviderService';

export interface IBaseServices {
    'files': IFileProviderService;
    'config': GlobalConfigService;
    'users': IUserService;
}

const serviceProviderSingletone = new ServiceLocator<IBaseServices>();

export function serviceLocator<T = object> (): ServiceLocator<IBaseServices & T> {
    return serviceProviderSingletone as ServiceLocator<IBaseServices & T>;
}

export function getService<KeyT extends keyof (IBaseServices & T), T = object> (service: KeyT){
    return (serviceProviderSingletone as ServiceLocator<IBaseServices & T>).get(service);
}