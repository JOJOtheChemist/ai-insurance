/**
 * 会话管理模块 - 主服务类
 */
import { Session, SessionDetail, SessionListOptions, UpdateSessionOptions } from './types';
/**
 * 会话管理服务类
 */
export declare class SessionManagementService {
    /**
     * 获取所有会话列表
     */
    getAllSessions(options?: SessionListOptions): Promise<Session[]>;
    /**
     * 获取单个会话详情
     */
    getSessionDetail(agentId: string): Promise<SessionDetail | null>;
    /**
     * 删除会话
     */
    deleteSession(agentId: string): Promise<boolean>;
    /**
     * 重命名会话
     */
    renameSession(agentId: string, newName: string): Promise<boolean>;
    /**
     * 更新会话信息
     */
    updateSession(agentId: string, options: UpdateSessionOptions): Promise<boolean>;
    /**
     * 检查会话是否存在
     */
    sessionExists(agentId: string): boolean;
    /**
     * 批量删除会话
     */
    batchDeleteSessions(agentIds: string[]): Promise<{
        success: string[];
        failed: string[];
    }>;
    /**
     * 获取会话统计
     */
    getSessionStats(agentId: string): Promise<{
        messagesCount: number;
        createdAt: string | null;
        updatedAt: string | null;
    } | null>;
    /**
     * 加载单个会话（内部方法）
     */
    private loadSession;
    /**
     * 排序会话列表
     */
    private sortSessions;
}
/**
 * 全局服务实例
 */
export declare const sessionService: SessionManagementService;
