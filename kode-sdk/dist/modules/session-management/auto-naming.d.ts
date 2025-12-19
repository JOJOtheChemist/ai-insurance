/**
 * 会话管理模块 - 自动命名逻辑
 */
/**
 * 自动生成会话标题
 * 基于第一条用户消息的内容
 */
export declare function generateSessionTitle(messages: any[]): string;
/**
 * 提取消息内容文本（用于列表显示）
 */
export declare function extractMessageContent(content: any): string;
