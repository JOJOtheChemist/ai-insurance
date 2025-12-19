/**
 * 会话管理模块 - 存储操作
 */
import { SessionMeta } from './types';
/**
 * 存储操作类
 */
export declare class SessionStorage {
    /**
     * 获取所有会话 ID
     */
    getAllSessionIds(): string[];
    /**
     * 检查会话是否存在
     */
    sessionExists(agentId: string): boolean;
    /**
     * 获取会话路径
     */
    getSessionPath(agentId: string): string;
    /**
     * 读取会话元数据
     */
    readMeta(agentId: string): SessionMeta;
    /**
     * 写入会话元数据
     */
    writeMeta(agentId: string, meta: SessionMeta): void;
    /**
     * 读取会话消息
     */
    readMessages(agentId: string): any[];
    /**
     * 删除会话
     */
    deleteSession(agentId: string): boolean;
    /**
     * 递归删除目录
     */
    private removeDirectory;
    /**
     * 重命名会话（更新自定义名称）
     */
    renameSession(agentId: string, newName: string): boolean;
    /**
     * 获取会话统计信息
     */
    getSessionStats(agentId: string): {
        messagesCount: number;
        createdAt: string | null;
        updatedAt: string | null;
    };
}
/**
 * 全局存储实例
 */
export declare const sessionStorage: SessionStorage;
