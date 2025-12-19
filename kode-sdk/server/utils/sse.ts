/**
 * Server-Sent Events (SSE) 工具函数
 */

import { Response } from 'express';

/**
 * 设置 SSE 响应头
 */
export function setupSSE(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

/**
 * 发送 SSE 事件
 */
export function sendSSEEvent(res: Response, type: string, data: any): void {
  res.write(`event: ${type}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * SSE 事件发送器类
 */
export class SSEEmitter {
  constructor(private res: Response, private sessionId?: string) {}

  /**
   * 发送事件（自动附加sessionId）
   */
  send(type: string, data: any): void {
    // 🔥 所有事件都携带sessionId，让前端知道消息属于哪个会话
    const eventData = this.sessionId 
      ? { ...data, sessionId: this.sessionId }
      : data;
    sendSSEEvent(this.res, type, eventData);
  }

  /**
   * 发送文本块
   */
  sendText(delta: string): void {
    this.send('text', { delta });
  }

  /**
   * 发送思考内容
   */
  sendThinking(delta: string): void {
    this.send('thinking', { delta });
  }

  /**
   * 发送工具调用开始事件
   */
  sendToolStart(name: string, input: any): void {
    this.send('tool_start', { name, input });
  }

  /**
   * 发送工具调用结束事件
   */
  sendToolEnd(name: string, duration: number, output?: any): void {
    this.send('tool_end', { name, duration, output });
  }

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
  }): void {
    this.send('tool', data);
  }

  /**
   * 发送错误事件
   */
  sendError(message: string, details?: any): void {
    this.send('error', { message, details });
  }

  /**
   * 发送完成事件
   */
  sendComplete(data?: any): void {
    this.send('complete', data || {});
  }

  /**
   * 结束连接
   */
  end(): void {
    this.res.end();
  }
}

