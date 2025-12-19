/**
 * 会话存储包装器
 * 已注释掉 MongoDB 同步功能，只使用文件存储
 *
 * 使用方法：
 * import { wrappedStorage } from './wrapper';
 *
 * 所有操作只执行文件存储操作
 */
import { SessionMeta } from './types';
/**
 * 包装后的存储类
 */
declare class WrappedSessionStorage {
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
     * 写入会话元数据（带同步）
     */
    writeMeta(agentId: string, meta: SessionMeta): void;
    /**
     * 读取会话消息
     */
    readMessages(agentId: string): any[];
    /**
     * 删除会话（带同步）
     */
    deleteSession(agentId: string): boolean;
    /**
     * 重命名会话（带同步）
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
    /**
     * 添加消息（新增方法，带同步）
     */
    appendMessage(agentId: string, message: any): void;
    /**
     * 批量写入消息（带同步）
     */
    writeMessages(agentId: string, messages: any[]): void;
}
/**
 * 导出包装后的存储实例
 */
export declare const wrappedStorage: WrappedSessionStorage;
export {};
/**
 * 同步层已被注释掉
 */
