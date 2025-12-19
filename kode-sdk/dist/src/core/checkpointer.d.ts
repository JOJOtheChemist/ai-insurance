import type { Message, ToolCallRecord } from './types';
import type { ToolDescriptor } from '../tools/registry';
/**
 * Agent 状态快照
 */
export interface AgentState {
    status: 'ready' | 'working' | 'paused' | 'completed' | 'failed';
    stepCount: number;
    lastSfpIndex: number;
    lastBookmark?: {
        seq: number;
        timestamp: number;
    };
}
/**
 * Checkpoint 数据结构
 */
export interface Checkpoint {
    id: string;
    agentId: string;
    sessionId?: string;
    timestamp: number;
    version: string;
    state: AgentState;
    messages: Message[];
    toolRecords: ToolCallRecord[];
    tools: ToolDescriptor[];
    config: {
        model: string;
        systemPrompt?: string;
        templateId?: string;
    };
    metadata: {
        isForkPoint?: boolean;
        parentCheckpointId?: string;
        tags?: string[];
        [key: string]: any;
    };
}
/**
 * Checkpoint 元数据（列表时使用）
 */
export interface CheckpointMetadata {
    id: string;
    agentId: string;
    sessionId?: string;
    timestamp: number;
    isForkPoint?: boolean;
    tags?: string[];
}
/**
 * Checkpointer 接口
 *
 * 提供可选的持久化机制，解耦 Store 强依赖
 */
export interface Checkpointer {
    /**
     * 保存 checkpoint
     */
    save(checkpoint: Checkpoint): Promise<string>;
    /**
     * 加载 checkpoint
     */
    load(checkpointId: string): Promise<Checkpoint | null>;
    /**
     * 列出 Agent 的所有 checkpoints
     */
    list(agentId: string, options?: {
        sessionId?: string;
        limit?: number;
        offset?: number;
    }): Promise<CheckpointMetadata[]>;
    /**
     * 删除 checkpoint
     */
    delete(checkpointId: string): Promise<void>;
    /**
     * Fork checkpoint（可选）
     */
    fork?(checkpointId: string, newAgentId: string): Promise<string>;
}
/**
 * 内存 Checkpointer（默认实现）
 */
export declare class MemoryCheckpointer implements Checkpointer {
    private checkpoints;
    save(checkpoint: Checkpoint): Promise<string>;
    load(checkpointId: string): Promise<Checkpoint | null>;
    list(agentId: string, options?: {
        sessionId?: string;
        limit?: number;
        offset?: number;
    }): Promise<CheckpointMetadata[]>;
    delete(checkpointId: string): Promise<void>;
    fork(checkpointId: string, newAgentId: string): Promise<string>;
}
