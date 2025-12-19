"use strict";
/**
 * 多用户会话存储 - 支持用户隔离
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
exports.multiUserStorage = exports.MultiUserSessionStorage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const KODE_DIR = path.join(process.cwd(), '.kode');
const USERS_DIR = KODE_DIR; // 用户数据直接在 .kode 目录下
/**
 * 多用户存储类
 */
class MultiUserSessionStorage {
    /**
     * 获取用户的会话目录
     */
    getUserSessionsDir(userId) {
        return path.join(USERS_DIR, userId);
    }
    /**
     * 获取用户的所有会话 ID
     */
    getAllSessionIds(userId) {
        const userDir = this.getUserSessionsDir(userId);
        console.log(`[MultiUserStorage] 查找用户 ${userId} 的会话，路径: ${userDir}`);
        if (!fs.existsSync(userDir)) {
            console.log(`[MultiUserStorage] 用户目录不存在: ${userDir}`);
            return [];
        }
        const sessionIds = fs.readdirSync(userDir)
            .filter(item => {
            const itemPath = path.join(userDir, item);
            return fs.statSync(itemPath).isDirectory();
        });
        console.log(`[MultiUserStorage] 找到 ${sessionIds.length} 个会话:`, sessionIds);
        return sessionIds;
    }
    /**
     * 检查会话是否存在（且属于该用户）
     */
    sessionExists(userId, agentId) {
        const sessionPath = path.join(this.getUserSessionsDir(userId), agentId);
        return fs.existsSync(sessionPath);
    }
    /**
     * 获取会话路径
     */
    getSessionPath(userId, agentId) {
        return path.join(this.getUserSessionsDir(userId), agentId);
    }
    /**
     * 读取会话元数据
     */
    readMeta(userId, agentId) {
        const metaPath = path.join(this.getUserSessionsDir(userId), agentId, 'meta.json');
        if (!fs.existsSync(metaPath)) {
            return {};
        }
        try {
            const metaData = fs.readFileSync(metaPath, 'utf-8');
            return JSON.parse(metaData);
        }
        catch (error) {
            console.error(`读取元数据失败 (${userId}/${agentId}):`, error);
            return {};
        }
    }
    /**
     * 写入会话元数据
     */
    writeMeta(userId, agentId, meta) {
        const sessionPath = path.join(this.getUserSessionsDir(userId), agentId);
        const metaPath = path.join(sessionPath, 'meta.json');
        // 确保用户目录和会话目录存在
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }
        // 更新时间戳
        const updatedMeta = {
            ...meta,
            userId, // 记录所属用户
            updated: new Date().toISOString()
        };
        fs.writeFileSync(metaPath, JSON.stringify(updatedMeta, null, 2), 'utf-8');
    }
    /**
     * 读取会话消息
     */
    readMessages(userId, agentId) {
        const messagesPath = path.join(this.getUserSessionsDir(userId), agentId, 'runtime', 'messages.json');
        if (!fs.existsSync(messagesPath)) {
            return [];
        }
        try {
            const messagesData = fs.readFileSync(messagesPath, 'utf-8');
            return JSON.parse(messagesData);
        }
        catch (error) {
            console.error(`读取消息失败 (${userId}/${agentId}):`, error);
            return [];
        }
    }
    /**
     * 删除会话
     */
    deleteSession(userId, agentId) {
        const sessionPath = path.join(this.getUserSessionsDir(userId), agentId);
        if (!fs.existsSync(sessionPath)) {
            return false;
        }
        try {
            this.removeDirectory(sessionPath);
            console.log(`✓ 会话已删除: ${userId}/${agentId}`);
            return true;
        }
        catch (error) {
            console.error(`删除会话失败 (${userId}/${agentId}):`, error);
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
     * 重命名会话
     */
    renameSession(userId, agentId, newName) {
        try {
            const meta = this.readMeta(userId, agentId);
            meta.customName = newName;
            this.writeMeta(userId, agentId, meta);
            console.log(`✓ 会话已重命名: ${userId}/${agentId} -> ${newName}`);
            return true;
        }
        catch (error) {
            console.error(`重命名会话失败 (${userId}/${agentId}):`, error);
            return false;
        }
    }
    /**
     * 获取会话统计信息
     */
    getSessionStats(userId, agentId) {
        const meta = this.readMeta(userId, agentId);
        const messages = this.readMessages(userId, agentId);
        return {
            messagesCount: messages.length,
            createdAt: meta.created || null,
            updatedAt: meta.updated || null
        };
    }
    /**
     * 获取所有用户列表（仅管理员）
     */
    getAllUsers() {
        if (!fs.existsSync(USERS_DIR)) {
            return [];
        }
        return fs.readdirSync(USERS_DIR)
            .filter(item => {
            const itemPath = path.join(USERS_DIR, item);
            return fs.statSync(itemPath).isDirectory();
        });
    }
    /**
     * 获取用户的会话总数
     */
    getUserSessionCount(userId) {
        return this.getAllSessionIds(userId).length;
    }
    /**
     * 创建新会话
     */
    createSession(userId, agentId, initialMeta) {
        try {
            const sessionPath = path.join(this.getUserSessionsDir(userId), agentId);
            // 检查会话是否已存在
            if (fs.existsSync(sessionPath)) {
                console.warn(`会话已存在: ${userId}/${agentId}`);
                return false;
            }
            // 创建会话目录和 runtime 目录
            fs.mkdirSync(path.join(sessionPath, 'runtime'), { recursive: true });
            // 创建初始元数据
            const meta = {
                ...initialMeta,
                userId,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            };
            // 写入元数据
            fs.writeFileSync(path.join(sessionPath, 'meta.json'), JSON.stringify(meta, null, 2), 'utf-8');
            // 创建空消息文件
            fs.writeFileSync(path.join(sessionPath, 'runtime', 'messages.json'), '[]', 'utf-8');
            console.log(`✓ 会话已创建: ${userId}/${agentId}`);
            return true;
        }
        catch (error) {
            console.error(`创建会话失败 (${userId}/${agentId}):`, error);
            return false;
        }
    }
}
exports.MultiUserSessionStorage = MultiUserSessionStorage;
/**
 * 全局多用户存储实例
 */
exports.multiUserStorage = new MultiUserSessionStorage();
/**
 * 原本的演示数据初始化函数已被禁用
 * 不再自动创建示例会话
 */
