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

    async listDir (path: string): Promise<string[]> {
        return [];
    }

    async exist (path: string): Promise<boolean> {
        return !!localStorage.getItem(path);
    }

    async mkdir (path: string): Promise<void> {
        await Promise.resolve();
    }
}
