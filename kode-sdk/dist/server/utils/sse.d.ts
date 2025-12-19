/**
 * Server-Sent Events (SSE) 工具函数
 */
import { Response } from 'express';
/**
 * 设置 SSE 响应头
 */
export declare function setupSSE(res: Response): void;
/**
 * 发送 SSE 事件
 */
export declare function sendSSEEvent(res: Response, type: string, data: any): void;
/**
 * SSE 事件发送器类
 */
export declare class SSEEmitter {
    private res;
    private sessionId?;
    constructor(res: Response, sessionId?: string | undefined);
    /**
     * 发送事件（自动附加sessionId）
     */
    send(type: string, data: any): void;
    /**
     * 发送文本块
     */
    sendText(delta: string): void;
    /**
     * 发送思考内容
     */
    sendThinking(delta: string): void;
    /**
     * 发送工具调用开始事件
     */
    sendToolStart(name: string, input: any): void;
    /**
     * 发送工具调用结束事件
     */
    sendToolEnd(name: string, duration: number, output?: any): void;
    /**
     * 发送工具调用事件
     */
    sendTool(data: {
        index: number;
        name: string;
        input: any;
        output: any;
        duration: number;
        state: string;
    }): void;
    /**
     * 发送错误事件
     */
    sendError(message: string, details?: any): void;
    /**
     * 发送完成事件
     */
    sendComplete(data?: any): void;
    /**
     * 结束连接
     */
    end(): void;
}
