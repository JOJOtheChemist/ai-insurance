/**
 * 多用户会话存储 - 支持用户隔离
 */
import { SessionMeta } from './types';
/**
 * 多用户存储类
 */
export declare class MultiUserSessionStorage {
    /**
     * 获取用户的会话目录
     */
    private getUserSessionsDir;
    /**
     * 获取用户的所有会话 ID
     */
    getAllSessionIds(userId: string): string[];
    /**
     * 检查会话是否存在（且属于该用户）
     */
    sessionExists(userId: string, agentId: string): boolean;
    /**
     * 获取会话路径
     */
    getSessionPath(userId: string, agentId: string): string;
    /**
     * 读取会话元数据
     */
    readMeta(userId: string, agentId: string): SessionMeta;
    /**
     * 写入会话元数据
     */
    writeMeta(userId: string, agentId: string, meta: SessionMeta): void;
    /**
     * 读取会话消息
     */
    readMessages(userId: string, agentId: string): any[];
    /**
     * 删除会话
     */
    deleteSession(userId: string, agentId: string): boolean;
    /**
     * 递归删除目录
     */
    private removeDirectory;
    /**
     * 重命名会话
     */
    renameSession(userId: string, agentId: string, newName: string): boolean;
    /**
     * 获取会话统计信息
     */
    getSessionStats(userId: string, agentId: string): {
        messagesCount: number;
        createdAt: string | null;
        updatedAt: string | null;
    };
    /**
     * 获取所有用户列表（仅管理员）
     */
    getAllUsers(): string[];
    /**
     * 获取用户的会话总数
     */
    getUserSessionCount(userId: string): number;
    /**
     * 创建新会话
     */
    createSession(userId: string, agentId: string, initialMeta?: Partial<SessionMeta>): boolean;
}
/**
 * 全局多用户存储实例
 */
export declare const multiUserStorage: MultiUserSessionStorage;
/**
 * 原本的演示数据初始化函数已被禁用
 * 不再自动创建示例会话
 */
