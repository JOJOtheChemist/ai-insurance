/**
 * Agent 服务层 - 管理 Agent 生命周期
 */
import { Agent } from '../../src';
import { AgentConfig } from '../agents/types';
/**
 * Agent 实例管理器
 */
declare class AgentManager {
    private agents;
    private processingLocks;
    private agentLastUsed;
    private cleanupInterval;
    private readonly AGENT_TIMEOUT_MS;
    private readonly CLEANUP_INTERVAL_MS;
    /**
     * 获取或创建 Agent
     */
    getOrCreateAgent(agentConfig: AgentConfig): Promise<Agent>;
    /**
     * 获取 Agent（不创建）
     */
    getAgent(agentId: string): Agent | undefined;
    /**
     * 检查会话是否正在处理
     * @param lockKey - 锁的键，格式: "userId:sessionId"
     */
    isProcessing(lockKey: string): boolean;
    /**
     * 设置会话处理锁
     * @param lockKey - 锁的键，格式: "userId:sessionId"
     * @param processing - 是否正在处理
     */
    setProcessing(lockKey: string, processing: boolean): void;
    /**
     * 获取所有 Agent ID
     */
    getAllAgentIds(): string[];
    /**
     * 清理 Agent
     */
    cleanup(agentId: string): Promise<void>;
    /**
     * 启动定期清理
     */
    startCleanup(): void;
    /**
     * 停止定期清理
     */
    stopCleanup(): void;
    /**
     * 清理不活跃的 Agent
     */
    private cleanupInactiveAgents;
    /**
     * 获取Agent统计信息
     */
    getStats(): {
        total: number;
        active: number;
        inactive: number;
    };
}
/**
 * 全局 Agent 管理器实例
 */
export declare const agentManager: AgentManager;
export {};
