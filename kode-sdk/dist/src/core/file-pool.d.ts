import { Sandbox } from '../infra/sandbox';
export interface FileRecord {
    path: string;
    lastRead?: number;
    lastEdit?: number;
    lastReadMtime?: number;
    lastKnownMtime?: number;
}
export interface FileFreshness {
    isFresh: boolean;
    lastRead?: number;
    lastEdit?: number;
    currentMtime?: number;
}
interface FilePoolOptions {
    watch?: boolean;
    onChange?: (event: {
        path: string;
        mtime: number;
    }) => void;
}
export declare class FilePool {
    private readonly sandbox;
    private records;
    private watchers;
    private readonly watchEnabled;
    private readonly onChange?;
    constructor(sandbox: Sandbox, opts?: FilePoolOptions);
    private getMtime;
    recordRead(path: string): Promise<void>;
    recordEdit(path: string): Promise<void>;
    validateWrite(path: string): Promise<FileFreshness>;
    checkFreshness(path: string): Promise<FileFreshness>;
    getTrackedFiles(): string[];
    private ensureWatch;
    getAccessedFiles(): Array<{
        path: string;
        mtime: number;
    }>;
}
export {};
