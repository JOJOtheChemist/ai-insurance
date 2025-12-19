"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileCheckpointer = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
/**
 * File-based Checkpointer
 *
 * 将 checkpoints 保存到本地文件系统
 */
class FileCheckpointer {
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    async save(checkpoint) {
        await this.ensureDir();
        const agentDir = path.join(this.baseDir, checkpoint.agentId);
        await fs_1.promises.mkdir(agentDir, { recursive: true });
        const filePath = path.join(agentDir, `${checkpoint.id}.json`);
        await fs_1.promises.writeFile(filePath, JSON.stringify(checkpoint, null, 2), 'utf-8');
        return checkpoint.id;
    }
    async load(checkpointId) {
        try {
            // 扫描所有 agent 目录查找 checkpoint
            const agentDirs = await fs_1.promises.readdir(this.baseDir);
            for (const agentId of agentDirs) {
                const agentDir = path.join(this.baseDir, agentId);
                const stat = await fs_1.promises.stat(agentDir);
                if (!stat.isDirectory())
                    continue;
                const filePath = path.join(agentDir, `${checkpointId}.json`);
                try {
                    const content = await fs_1.promises.readFile(filePath, 'utf-8');
                    return JSON.parse(content);
                }
                catch {
                    continue;
                }
            }
            return null;
        }
        catch {
            return null;
        }
    }
    async list(agentId, options) {
        const agentDir = path.join(this.baseDir, agentId);
        try {
            const files = await fs_1.promises.readdir(agentDir);
            const checkpoints = [];
            for (const file of files) {
                if (!file.endsWith('.json'))
                    continue;
                const filePath = path.join(agentDir, file);
                const content = await fs_1.promises.readFile(filePath, 'utf-8');
                const checkpoint = JSON.parse(content);
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
            // 按时间排序
            checkpoints.sort((a, b) => b.timestamp - a.timestamp);
            // 分页
            const start = options?.offset || 0;
            const end = options?.limit ? start + options.limit : undefined;
            return checkpoints.slice(start, end);
        }
        catch {
            return [];
        }
    }
    async delete(checkpointId) {
        try {
            const agentDirs = await fs_1.promises.readdir(this.baseDir);
            for (const agentId of agentDirs) {
                const filePath = path.join(this.baseDir, agentId, `${checkpointId}.json`);
                try {
                    await fs_1.promises.unlink(filePath);
                    return;
                }
                catch {
                    continue;
                }
            }
        }
        catch {
            // Ignore errors
        }
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
    async ensureDir() {
        await fs_1.promises.mkdir(this.baseDir, { recursive: true });
    }
}
exports.FileCheckpointer = FileCheckpointer;
