export interface IFileMetadata {
    size: number;
    /** posix access time in milliseconds */
    aTimeMs: number;
    /** posix creating time in milliseconds */
    cTimeMs: number;
    /** posix modifiyng time in milliseconds */
    mTimeMs: number;
    isFile: boolean;
    isDir: boolean;
}
export interface IFileProvider {
    type: 'browser' | 'os';
    read: (path: string) => Promise<string>;
    write: (path: string, content: string) => Promise<void>;
    append: (path: string, content: string) => Promise<void>;
    listDir: (path: string) => Promise<string[]>;
    exist: (path: string) => Promise<boolean>;
    mkdir: (path: string) => Promise<void>;
    join: (...path: string[]) => string;
    dirname: (path: string) => string;
    filename: (path: string) => string;
    fileMetadata: (path: string) => IFileMetadata;
}
