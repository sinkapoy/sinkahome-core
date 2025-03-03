import { type IFileMetadata } from './IFileProvider';
import { type IFileProviderService } from './IFileProviderService';

export class BrowserFileProvider implements IFileProviderService {
    public readonly type = 'browser';

    get inited (): boolean {
        return true;
    }

    init (): void {
        //
    }

    async read (path: string): Promise<string> {
        return localStorage.getItem(path) ?? '';
    }

    async write (path: string, content: string): Promise<void> {
        localStorage.setItem(path, content);
    }

    async append (path: string, content: string): Promise<void> {
        const file = await this.read(path) ?? '';
        await this.write(path, file + content);
    }

    async listDir (_path: string): Promise<string[]> {
        return [];
    }

    async exist (path: string): Promise<boolean> {
        return !!localStorage.getItem(path);
    }

    async mkdir (_path: string): Promise<void> {
        await Promise.resolve();
    }

    join (...path: string[]): string {
        return path.join('/').replace(/\/\//g, '/');
    }

    dirname (path: string): string {
        return path;
    }

    filename (path: string): string {
        return path;
    }

    fileMetadata (_path: string): IFileMetadata {
        throw new Error('not implemented fileMetadata for browsers');
    };
}
