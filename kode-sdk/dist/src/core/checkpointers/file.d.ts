import type { Checkpointer, Checkpoint, CheckpointMetadata } from '../checkpointer';
/**
 * File-based Checkpointer
 *
 * 将 checkpoints 保存到本地文件系统
 */
export declare class FileCheckpointer implements Checkpointer {
    private readonly baseDir;
    constructor(baseDir: string);
    save(checkpoint: Checkpoint): Promise<string>;
    load(checkpointId: string): Promise<Checkpoint | null>;
    list(agentId: string, options?: {
        sessionId?: string;
        limit?: number;
        offset?: number;
    }): Promise<CheckpointMetadata[]>;
    delete(checkpointId: string): Promise<void>;
    fork(checkpointId: string, newAgentId: string): Promise<string>;
    private ensureDir;
}
