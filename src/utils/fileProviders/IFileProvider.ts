export interface IFileProvider {
    type: 'browser' | 'os'
    read: (path: string) => Promise<string>
    write: (path: string, content: string) => Promise<void>
    append: (path: string, content: string) => Promise<void>
    listDir: (path: string) => Promise<string[]>
    exist: (path: string) => Promise<boolean>
    mkdir: (path: string) => Promise<void>
}
