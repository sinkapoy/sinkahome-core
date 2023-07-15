import { existsSync } from "fs";
import { IFileProvider } from "./IFileProvider";
import { appendFile, mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";

export class OsFileProvider implements IFileProvider {
    public readonly type = 'os';

    async read(path: string): Promise<string> {
        if(existsSync(path)){
            return readFile(path,{encoding: 'utf-8'});
        } else {
            return '';
        }
    }

    async write(path: string, content: string): Promise<void> {
        const dirPath = dirname(path);
        if(!existsSync(dirPath)){
            await mkdir(dirPath, {recursive: true});
        }
        await writeFile(path, content, {encoding: 'utf-8'});
    }

    async append(path: string, content: string): Promise<void> {
        if(!existsSync(path)){
            return this.write(path, content);
        } 
        await appendFile(path, content, {encoding: 'utf-8'});
    }
}