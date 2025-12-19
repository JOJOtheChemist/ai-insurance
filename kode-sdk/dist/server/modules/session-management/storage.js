"use strict";
/**
 * 会话管理模块 - 存储操作
 */
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
exports.sessionStorage = exports.SessionStorage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const KODE_DIR = path.join(process.cwd(), '.kode');
/**
 * 存储操作类
 */
class SessionStorage {
    /**
     * 获取所有会话 ID
     */
    getAllSessionIds() {
        if (!fs.existsSync(KODE_DIR)) {
            return [];
        }
        return fs.readdirSync(KODE_DIR)
            .filter(item => {
            const itemPath = path.join(KODE_DIR, item);
            return fs.statSync(itemPath).isDirectory();
        });
    }
    /**
     * 检查会话是否存在
     */
    sessionExists(agentId) {
        const agentPath = path.join(KODE_DIR, agentId);
        return fs.existsSync(agentPath);
    }
    /**
     * 获取会话路径
     */
    getSessionPath(agentId) {
        return path.join(KODE_DIR, agentId);
    }
    /**
     * 读取会话元数据
     */
    readMeta(agentId) {
        const metaPath = path.join(KODE_DIR, agentId, 'meta.json');
        if (!fs.existsSync(metaPath)) {
            return {};
        }
        try {
            const metaData = fs.readFileSync(metaPath, 'utf-8');
            return JSON.parse(metaData);
        }
        catch (error) {
            console.error(`读取元数据失败 (${agentId}):`, error);
            return {};
        }
    }
    /**
     * 写入会话元数据
     */
    writeMeta(agentId, meta) {
        const metaPath = path.join(KODE_DIR, agentId, 'meta.json');
        // 确保目录存在
        const agentPath = path.join(KODE_DIR, agentId);
        if (!fs.existsSync(agentPath)) {
            fs.mkdirSync(agentPath, { recursive: true });
        }
        // 更新时间戳
        const updatedMeta = {
            ...meta,
            updated: new Date().toISOString()
        };
        fs.writeFileSync(metaPath, JSON.stringify(updatedMeta, null, 2), 'utf-8');
    }
    /**
     * 读取会话消息
     */
    readMessages(agentId) {
        const messagesPath = path.join(KODE_DIR, agentId, 'runtime', 'messages.json');
        if (!fs.existsSync(messagesPath)) {
            return [];
        }
        try {
            const messagesData = fs.readFileSync(messagesPath, 'utf-8');
            return JSON.parse(messagesData);
        }
        catch (error) {
            console.error(`读取消息失败 (${agentId}):`, error);
            return [];
        }
    }
    /**
     * 删除会话
     */
    deleteSession(agentId) {
        const agentPath = path.join(KODE_DIR, agentId);
        if (!fs.existsSync(agentPath)) {
            return false;
        }
        try {
            // 递归删除整个会话目录
            this.removeDirectory(agentPath);
            console.log(`✓ 会话已删除: ${agentId}`);
            return true;
        }
        catch (error) {
            console.error(`删除会话失败 (${agentId}):`, error);
            return false;
        }
    }
    /**
     * 递归删除目录
     */
    removeDirectory(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => {
                const curPath = path.join(dirPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    this.removeDirectory(curPath);
                }
                else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirPath);
        }
    }
    /**
     * 重命名会话（更新自定义名称）
     */
    renameSession(agentId, newName) {
        try {
            const meta = this.readMeta(agentId);
            meta.customName = newName;
            this.writeMeta(agentId, meta);
            console.log(`✓ 会话已重命名: ${agentId} -> ${newName}`);
            return true;
        }
        catch (error) {
            console.error(`重命名会话失败 (${agentId}):`, error);
            return false;
        }
    }
    /**
     * 获取会话统计信息
     */
    getSessionStats(agentId) {
        const meta = this.readMeta(agentId);
        const messages = this.readMessages(agentId);
        return {
            messagesCount: messages.length,
            createdAt: meta.created || null,
            updatedAt: meta.updated || null
        };
    }
}
exports.SessionStorage = SessionStorage;
/**
 * 全局存储实例
 */
exports.sessionStorage = new SessionStorage();
