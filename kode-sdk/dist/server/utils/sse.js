"use strict";
/**
 * Server-Sent Events (SSE) 工具函数
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEEmitter = void 0;
exports.setupSSE = setupSSE;
exports.sendSSEEvent = sendSSEEvent;
/**
 * 设置 SSE 响应头
 */
function setupSSE(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
}
/**
 * 发送 SSE 事件
 */
function sendSSEEvent(res, type, data) {
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}
/**
 * SSE 事件发送器类
 */
class SSEEmitter {
    constructor(res, sessionId) {
        this.res = res;
        this.sessionId = sessionId;
    }
    /**
     * 发送事件（自动附加sessionId）
     */
    send(type, data) {
        // 🔥 所有事件都携带sessionId，让前端知道消息属于哪个会话
        const eventData = this.sessionId
            ? { ...data, sessionId: this.sessionId }
            : data;
        sendSSEEvent(this.res, type, eventData);
    }
    /**
     * 发送文本块
     */
    sendText(delta) {
        this.send('text', { delta });
    }
    /**
     * 发送思考内容
     */
    sendThinking(delta) {
        this.send('thinking', { delta });
    }
    /**
     * 发送工具调用开始事件
     */
    sendToolStart(name, input) {
        this.send('tool_start', { name, input });
    }
    /**
     * 发送工具调用结束事件
     */
    sendToolEnd(name, duration, output) {
        this.send('tool_end', { name, duration, output });
    }
    /**
     * 发送工具调用事件
     */
    sendTool(data) {
        this.send('tool', data);
    }
    /**
     * 发送错误事件
     */
    sendError(message, details) {
        this.send('error', { message, details });
    }
    /**
     * 发送完成事件
     */
    sendComplete(data) {
        this.send('complete', data || {});
    }
    /**
     * 结束连接
     */
    end() {
        this.res.end();
    }
}
exports.SSEEmitter = SSEEmitter;
