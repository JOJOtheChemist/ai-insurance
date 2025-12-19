"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = void 0;
class MessageQueue {
    constructor(options) {
        this.options = options;
        this.pending = [];
    }
    send(text, opts = {}) {
        const kind = opts.kind ?? 'user';
        const payload = kind === 'reminder' ? this.options.wrapReminder(text, opts.reminder) : text;
        const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this.pending.push({
            message: {
                role: 'user',
                content: [{ type: 'text', text: payload }],
            },
            kind,
            metadata: { id, ...(opts.metadata || {}) },
        });
        if (kind === 'user') {
            this.options.ensureProcessing();
        }
        return id;
    }
    async flush() {
        if (this.pending.length === 0)
            return;
        const queue = this.pending;
        try {
            // 先添加到消息历史
            for (const entry of queue) {
                this.options.addMessage(entry.message, entry.kind);
            }
            // 持久化成功后才清空队列
            await this.options.persist();
            // 成功：从队列中移除已处理的消息
            this.pending = this.pending.filter(item => !queue.includes(item));
        }
        catch (err) {
            // 失败：保留队列，下次重试
            console.error('[MessageQueue] Flush failed, messages retained:', err);
            throw err; // 重新抛出让调用者知道失败
        }
    }
}
exports.MessageQueue = MessageQueue;
