import type { Checkpointer, Checkpoint, CheckpointMetadata } from '../checkpointer';
/**
 * Redis 配置
 */
export interface RedisCheckpointerConfig {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    ttl?: number;
}
/**
 * Redis-based Checkpointer
 *
 * 使用 Redis 存储 checkpoints（需要 ioredis）
 */
export declare class RedisCheckpointer implements Checkpointer {
    private redis;
    private keyPrefix;
    private ttl?;
    constructor(config?: RedisCheckpointerConfig);
    save(checkpoint: Checkpoint): Promise<string>;
    load(checkpointId: string): Promise<Checkpoint | null>;
    list(agentId: string, options?: {
        sessionId?: string;
        limit?: number;
        offset?: number;
    }): Promise<CheckpointMetadata[]>;
    delete(checkpointId: string): Promise<void>;
    fork(checkpointId: string, newAgentId: string): Promise<string>;
    disconnect(): Promise<void>;
    private getKey;
    private getIndexKey;
}
