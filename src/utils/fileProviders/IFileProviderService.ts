import { type IService } from '../ServiceLocator';
import { type IFileProvider } from './IFileProvider';

export interface IFileProviderService extends IFileProvider, IService {
    //
}
