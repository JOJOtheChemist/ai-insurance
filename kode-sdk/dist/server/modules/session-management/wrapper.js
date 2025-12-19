"use strict";
/**
 * 会话存储包装器
 * 已注释掉 MongoDB 同步功能，只使用文件存储
 *
 * 使用方法：
 * import { wrappedStorage } from './wrapper';
 *
 * 所有操作只执行文件存储操作
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrappedStorage = void 0;
const storage_1 = require("./storage");
// 注释掉整个wrapper模块，只使用文件存储
// 这个文件不再需要
/**
 * 包装后的存储类
 */
class WrappedSessionStorage {
    /**
     * 获取所有会话 ID
     */
    getAllSessionIds() {
        return storage_1.sessionStorage.getAllSessionIds();
    }
    /**
     * 检查会话是否存在
     */
    sessionExists(agentId) {
        return storage_1.sessionStorage.sessionExists(agentId);
    }
    /**
     * 获取会话路径
     */
    getSessionPath(agentId) {
        return storage_1.sessionStorage.getSessionPath(agentId);
    }
    /**
     * 读取会话元数据
     */
    readMeta(agentId) {
        return storage_1.sessionStorage.readMeta(agentId);
    }
    /**
     * 写入会话元数据（带同步）
     */
    writeMeta(agentId, meta) {
        // 1. 原有操作：写入文件
        storage_1.sessionStorage.writeMeta(agentId, meta);
        // 2. 注释掉 MongoDB 同步
        // syncLayer.syncToMongoDB(agentId).catch(err => {
        //   console.error('[Wrapper] Meta 同步失败:', err);
        // });
    }
    /**
     * 读取会话消息
     */
    readMessages(agentId) {
        return storage_1.sessionStorage.readMessages(agentId);
    }
    /**
     * 删除会话（带同步）
     */
    deleteSession(agentId) {
        // 1. 原有操作：删除文件
        const result = storage_1.sessionStorage.deleteSession(agentId);
        // 2. 注释掉 MongoDB 删除
        // if (result) {
        //   syncLayer.onSessionDeleted(agentId).catch(err => {
        //     console.error('[Wrapper] 删除同步失败:', err);
        //   });
        // }
        return result;
    }
    /**
     * 重命名会话（带同步）
     */
    renameSession(agentId, newName) {
        // 1. 原有操作：重命名文件
        const result = storage_1.sessionStorage.renameSession(agentId, newName);
        // 2. 注释掉 MongoDB 同步
        // if (result) {
        //   syncLayer.onSessionRenamed(agentId, newName).catch(err => {
        //     console.error('[Wrapper] 重命名同步失败:', err);
        //   });
        // }
        return result;
    }
    /**
     * 获取会话统计信息
     */
    getSessionStats(agentId) {
        return storage_1.sessionStorage.getSessionStats(agentId);
    }
    /**
     * 添加消息（新增方法，带同步）
     */
    appendMessage(agentId, message) {
        // 1. 读取现有消息
        const messages = this.readMessages(agentId);
        // 2. 添加新消息
        messages.push(message);
        // 3. 写回文件（使用原有方法）
        const agentPath = this.getSessionPath(agentId);
        const fs = require('fs');
        const path = require('path');
        const runtimePath = path.join(agentPath, 'runtime');
        const messagesPath = path.join(runtimePath, 'messages.json');
        if (!fs.existsSync(runtimePath)) {
            fs.mkdirSync(runtimePath, { recursive: true });
        }
        fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
        // 4. 注释掉 MongoDB 同步
        // syncLayer.onMessageAdded(agentId, message).catch(err => {
        //   console.error('[Wrapper] 消息同步失败:', err);
        // });
    }
    /**
     * 批量写入消息（带同步）
     */
    writeMessages(agentId, messages) {
        const agentPath = this.getSessionPath(agentId);
        const fs = require('fs');
        const path = require('path');
        const runtimePath = path.join(agentPath, 'runtime');
        const messagesPath = path.join(runtimePath, 'messages.json');
        if (!fs.existsSync(runtimePath)) {
            fs.mkdirSync(runtimePath, { recursive: true });
        }
        fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
        // 注释掉 MongoDB 同步
        // syncLayer.syncToMongoDB(agentId).catch(err => {
        //   console.error('[Wrapper] 消息批量同步失败:', err);
        // });
    }
}
/**
 * 导出包装后的存储实例
 */
exports.wrappedStorage = new WrappedSessionStorage();
/**
 * 同步层已被注释掉
 */
// export { syncLayer } from './sync-layer';
