import { type GlobalConfigService } from './services/GlobalConfigService';
import { ServiceLocator } from './utils/ServiceLocator';
import { type IFileProviderService } from './utils/fileProviders/IFileProviderService';

export interface IBaseServices {
    'files': IFileProviderService
    'config': GlobalConfigService
}

const serviceProviderSingletone = new ServiceLocator<IBaseServices>();

export function serviceLocator<T = object> (): ServiceLocator<IBaseServices & T> {
    return serviceProviderSingletone as ServiceLocator<IBaseServices & T>;
}
