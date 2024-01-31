import { serviceLocator } from '../../serviceLocator';
import { VmType, checkVM } from '../common';
import { BrowserFileProvider } from './BrowserFileProvider';
import { type IFileProviderService } from './IFileProviderService';
import { OsFileProvider } from './OsFileProvider';

let fileSystemProvider: IFileProviderService;
// eslint-disable-next-line
if (checkVM() == VmType.BROWSER) {
    fileSystemProvider = new BrowserFileProvider();
} else {
    fileSystemProvider = new OsFileProvider();
}

serviceLocator().set('files', fileSystemProvider);
