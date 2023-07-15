import { IFileProvider } from "./IFileProvider";

export class BrowserFileProvider implements IFileProvider {
    public readonly type = 'browser';

    async read(path: string): Promise<string> {
        return localStorage.getItem(path) ?? '';
    }

    async write(path: string, content: string): Promise<void> {
        localStorage.setItem(path, content);
    }

    async append(path: string, content: string): Promise<void> {
        const file = await this.read(path) ?? '';
        await this.write(path, file + content);
    }
}