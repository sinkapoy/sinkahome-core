import { IFileProvider } from "@root/src/utils/fileProviders/IFileProvider";
import { HomeSystem } from "../HomeSystem";
import { FileProviderFabric } from "@root/src/utils/fileProviders/FileProviderFabric";

type FileT = {
    path: string;
    content: string;
}

export interface IFileEvents {
    'readFile': [string];
    'fileContent': [FileT];
    'writeFile': [FileT];
    'appendFile': [FileT];
}

export class FileProviderSystem extends HomeSystem{
    private fileDriver: IFileProvider = new FileProviderFabric().getFileProvider();
    
    onInit(): void {
        this.setupEvent('readFile', async(path: string)=>{
            const content = await this.fileDriver.read(path);

            this.engine.emit('fileContent', {
                path,
                content
            });
        });
        this.setupEvent('writeFile', (file: FileT)=>{
            this.fileDriver.write(file.path, file.content);
        });
        this.setupEvent('appendFile', (file: FileT)=>{
            this.fileDriver.append(file.path, file.content);
        });
    }

    onDestroy(): void {
        
    }

    onUpdate(dt: number): void {
        
    }
}