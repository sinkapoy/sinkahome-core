import type path from "path";
import { IFileProvider } from "./IFileProvider";
let existsSync;
let fsPromises;
let dirname: typeof path.dirname;
if (!process.env['browser']) {
    existsSync = require("fs").existsSync;
    fsPromises = require("fs/promises");
    dirname = require("path").dirname;
}


export class OsFileProvider implements IFileProvider {
    public readonly type = 'os';

    async read(path: string): Promise<string> {
        if (existsSync(path)) {
            return fsPromises.readFile(path, { encoding: 'utf-8' });
        } else {
            return '';
        }
    }

    async write(path: string, content: string): Promise<void> {
        const dirPath = dirname(path);
        if (!existsSync(dirPath)) {
            await fsPromises.mkdir(dirPath, { recursive: true });
        }
        await fsPromises.writeFile(path, content, { encoding: 'utf-8' });
    }

    async append(path: string, content: string): Promise<void> {
        if (!existsSync(path)) {
            return this.write(path, content);
        }
        await fsPromises.appendFile(path, content, { encoding: 'utf-8' });
    }
}