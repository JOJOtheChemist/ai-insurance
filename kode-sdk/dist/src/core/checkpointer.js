"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCheckpointer = void 0;
/**
 * 内存 Checkpointer（默认实现）
 */
class MemoryCheckpointer {
    constructor() {
        this.checkpoints = new Map();
    }
    async save(checkpoint) {
        this.checkpoints.set(checkpoint.id, JSON.parse(JSON.stringify(checkpoint)));
        return checkpoint.id;
    }
    async load(checkpointId) {
        const checkpoint = this.checkpoints.get(checkpointId);
        return checkpoint ? JSON.parse(JSON.stringify(checkpoint)) : null;
    }
    async list(agentId, options) {
        const allCheckpoints = Array.from(this.checkpoints.values())
            .filter((cp) => cp.agentId === agentId)
            .filter((cp) => !options?.sessionId || cp.sessionId === options.sessionId)
            .sort((a, b) => b.timestamp - a.timestamp);
        const start = options?.offset || 0;
        const end = options?.limit ? start + options.limit : undefined;
        const slice = allCheckpoints.slice(start, end);
        return slice.map((cp) => ({
            id: cp.id,
            agentId: cp.agentId,
            sessionId: cp.sessionId,
            timestamp: cp.timestamp,
            isForkPoint: cp.metadata.isForkPoint,
            tags: cp.metadata.tags,
        }));
    }
    async delete(checkpointId) {
        this.checkpoints.delete(checkpointId);
    }
    async fork(checkpointId, newAgentId) {
        const original = await this.load(checkpointId);
        if (!original) {
            throw new Error(`Checkpoint not found: ${checkpointId}`);
        }
        const forked = {
            ...original,
            id: `${newAgentId}:${Date.now()}`,
            agentId: newAgentId,
            timestamp: Date.now(),
            metadata: {
                ...original.metadata,
                parentCheckpointId: checkpointId,
            },
        };
        return await this.save(forked);
    }
}
exports.MemoryCheckpointer = MemoryCheckpointer;
