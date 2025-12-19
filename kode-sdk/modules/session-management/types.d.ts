/**
 * 会话管理模块 - 类型定义
 */
/**
 * 会话基本信息
 */
export interface Session {
    id: string;
    name: string;
    agentId: string;
    description: string;
    type: string;
    messagesCount: number;
    createdAt: string | null;
    updatedAt: string | null;
    isOnline: boolean;
    category: string;
    messages: SessionMessage[];
}
/**
 * 会话消息
 */
export interface SessionMessage {
    id: string;
    role: string;
    content: any;
    timestamp: string | null;
    dateTime: string | null;
}
/**
 * 会话详情
 */
export interface SessionDetail {
    id: string;
    agentId: string;
    meta: SessionMeta;
    messages: Array<{
        id: string;
        role: string;
        content: any;
        timestamp: string | null;
    }>;
}
/**
 * 会话元数据
 */
export interface SessionMeta {
    created?: string;
    updated?: string;
    customName?: string;
    [key: string]: any;
}
/**
 * 会话创建选项
 */
export interface CreateSessionOptions {
    agentId: string;
    templateId?: string;
    customName?: string;
}
/**
 * 会话更新选项
 */
export interface UpdateSessionOptions {
    customName?: string;
    meta?: Partial<SessionMeta>;
}
/**
 * 会话列表查询选项
 */
export interface SessionListOptions {
    category?: string;
    type?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'messagesCount' | 'name';
    sortOrder?: 'asc' | 'desc';
}
