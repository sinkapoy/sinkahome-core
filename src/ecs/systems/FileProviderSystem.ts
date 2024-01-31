import { type IFileProvider } from '../../utils/fileProviders/IFileProvider';
import { serviceLocator } from '../../serviceLocator';
import { HomeSystem } from '../HomeSystem';

interface FileT {
    path: string
    content: string
}

/**
 * @deprecated
 */
export interface IFileEvents {
    'readFile': [string]
    'fileContent': [FileT]
    'writeFile': [FileT]
    'appendFile': [FileT]
    'listDir': [dirPath: string]
    'dirFiles': [dirPath: string, dirFileNames: string[]]
}

/**
 * @deprecated
 */
export class FileProviderSystem extends HomeSystem {
    private readonly fileDriver: IFileProvider = serviceLocator().get('files');

    onInit (): void {
        this.setupEvent('readFile', async (path: string) => {
            const content = await this.fileDriver.read(path);

            this.engine.emit('fileContent', {
                path,
                content
            });
        });
        this.setupEvent('writeFile', (file: FileT) => {
            this.fileDriver.write(file.path, file.content);
        });
        this.setupEvent('appendFile', (file: FileT) => {
            this.fileDriver.append(file.path, file.content);
        });

        this.setupEvent('listDir', async (dir) => {
            this.engine.emit('dirFiles', dir, await this.fileDriver.listDir(dir));
        });
    }

    onDestroy (): void {

    }

    onUpdate (dt: number): void {

    }
}
