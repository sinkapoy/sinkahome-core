/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable global-require */

import type PathT from 'path';
import { type IFileProviderService } from './IFileProviderService';

declare type FsPromisesModuleT = typeof import('node:fs/promises');
declare type FsModuleT = typeof import('node:fs');
let fsPromises: FsPromisesModuleT;
let fs: FsModuleT;
let dirname: typeof PathT.dirname;

if (!process.env.browser) {
    /* eslint-disable */
    fsPromises = require('fs/promises') as FsPromisesModuleT;
    fs = require('fs') as FsModuleT;
    dirname = require('path').dirname;
    /* eslint-enable */
}

export class OsFileProvider implements IFileProviderService {
    public readonly type = 'os';

    get inited (): boolean {
        return true;
    }

    init (): void {
        //
    }

    async read (path: string): Promise<string> {
        if (fs.existsSync(path)) {
            const file = await fsPromises.readFile(path, { encoding: 'utf-8' });
            return file;
        }
        return '';
    }

    async write (path: string, content: string): Promise<void> {
        const dirPath = dirname(path);
        if (!fs.existsSync(dirPath)) {
            await fsPromises.mkdir(dirPath, { recursive: true });
        }
        await fsPromises.writeFile(path, content, { encoding: 'utf-8' });
    }

    async append (path: string, content: string): Promise<void> {
        if (!fs.existsSync(path)) {
            await this.write(path, content); return;
        }
        await fsPromises.appendFile(path, content, { encoding: 'utf-8' });
    }

    async listDir (path: string): Promise<string[]> {
        return (await fsPromises.readdir(path, { withFileTypes: true, recursive: true }))
            .map((f) => f.name);
    }

    async exist (path: string): Promise<boolean> {
        try {
            await fsPromises.lstat(path);
            return true;
        } catch {
            return false;
        }
    }

    async mkdir (p: string): Promise<void> {
        await fsPromises.mkdir(p, { recursive: true });
    }
}
