import { ServiceLocator } from './utils/ServiceLocator';
import { type IFileProviderService } from './utils/fileProviders/IFileProviderService';

export interface IBaseServices {
    'files': IFileProviderService
}

const serviceProviderSingletone = new ServiceLocator<IBaseServices>();

export function serviceLocator<T = object> (): ServiceLocator<IBaseServices & T> {
    return serviceProviderSingletone as ServiceLocator<IBaseServices & T>;
}
