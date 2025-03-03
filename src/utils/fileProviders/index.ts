import { VmType, checkVM } from '../common';
import { BrowserFileProvider } from './BrowserFileProvider';
import { type IFileProviderService } from './IFileProviderService';
import { OsFileProvider } from './OsFileProvider';

export function getFileSystemProvider (): IFileProviderService {
    let fileSystemProvider: IFileProviderService;
     
    if (checkVM() == VmType.BROWSER) {
        fileSystemProvider = new BrowserFileProvider();
    } else {
        fileSystemProvider = new OsFileProvider();
    }
    return fileSystemProvider;
}
