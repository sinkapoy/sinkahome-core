import { BrowserFileProvider } from "./BrowserFileProvider";
import { IFileProvider } from "./IFileProvider";
import { OsFileProvider } from "./OsFileProvider";

export class FileProviderFabric {
    getFileProvider(): IFileProvider {
        if(globalThis.window){
            return new BrowserFileProvider();
        } else {
            return new OsFileProvider();
        }
    }
}