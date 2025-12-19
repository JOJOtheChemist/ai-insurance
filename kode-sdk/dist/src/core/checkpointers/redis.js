"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCheckpointer = void 0;
/**
 * Redis-based Checkpointer
 *
 * 使用 Redis 存储 checkpoints（需要 ioredis）
 */
class RedisCheckpointer {
    constructor(config = {}) {
        this.keyPrefix = config.keyPrefix || 'kode:checkpoint:';
        this.ttl = config.ttl;
        // 延迟加载 ioredis（可选依赖）
        try {
            const Redis = require('ioredis');
            this.redis = new Redis({
                host: config.host || 'localhost',
                port: config.port || 6379,
                password: config.password,
                db: config.db || 0,
            });
        }
        catch (error) {
            throw new Error('ioredis is required for RedisCheckpointer. Install it with: npm install ioredis');
        }
    }
    async save(checkpoint) {
        const key = this.getKey(checkpoint.id);
        const value = JSON.stringify(checkpoint);
        if (this.ttl) {
            await this.redis.setex(key, this.ttl, value);
        }
        else {
            await this.redis.set(key, value);
        }
        // 添加到 agent 的索引
        const indexKey = this.getIndexKey(checkpoint.agentId);
        await this.redis.zadd(indexKey, checkpoint.timestamp, checkpoint.id);
        return checkpoint.id;
    }
    async load(checkpointId) {
        const key = this.getKey(checkpointId);
        const value = await this.redis.get(key);
        if (!value)
            return null;
        return JSON.parse(value);
    }
    async list(agentId, options) {
        const indexKey = this.getIndexKey(agentId);
        // 按时间倒序获取 checkpoint IDs
        const start = options?.offset || 0;
        const end = options?.limit ? start + options.limit - 1 : -1;
        const ids = await this.redis.zrevrange(indexKey, start, end);
        const checkpoints = [];
        for (const id of ids) {
            const checkpoint = await this.load(id);
            if (!checkpoint)
                continue;
            if (options?.sessionId && checkpoint.sessionId !== options.sessionId) {
                continue;
            }
            checkpoints.push({
                id: checkpoint.id,
                agentId: checkpoint.agentId,
                sessionId: checkpoint.sessionId,
                timestamp: checkpoint.timestamp,
                isForkPoint: checkpoint.metadata.isForkPoint,
                tags: checkpoint.metadata.tags,
            });
        }
        return checkpoints;
    }
    async delete(checkpointId) {
        const checkpoint = await this.load(checkpointId);
        if (!checkpoint)
            return;
        // 删除 checkpoint
        const key = this.getKey(checkpointId);
        await this.redis.del(key);
        // 从索引中移除
        const indexKey = this.getIndexKey(checkpoint.agentId);
        await this.redis.zrem(indexKey, checkpointId);
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
    async disconnect() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
    getKey(checkpointId) {
        return `${this.keyPrefix}${checkpointId}`;
    }
    getIndexKey(agentId) {
        return `${this.keyPrefix}index:${agentId}`;
    }
}
exports.RedisCheckpointer = RedisCheckpointer;
