"use strict";
/**
 * 会话管理模块 - 主服务类
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = exports.SessionManagementService = void 0;
const storage_1 = require("./storage");
const auto_naming_1 = require("./auto-naming");
/**
 * 会话管理服务类
 */
class SessionManagementService {
    /**
     * 获取所有会话列表
     */
    async getAllSessions(options) {
        console.log('[SessionService] 获取会话列表...');
        const sessionIds = storage_1.sessionStorage.getAllSessionIds();
        const sessions = [];
        for (const agentId of sessionIds) {
            try {
                const session = await this.loadSession(agentId);
                if (session) {
                    sessions.push(session);
                }
            }
            catch (error) {
                console.error(`✗ 加载会话失败 (${agentId}):`, error);
            }
        }
        // 排序
        if (options?.sortBy) {
            this.sortSessions(sessions, options.sortBy, options.sortOrder || 'desc');
        }
        console.log(`[SessionService] 成功加载 ${sessions.length} 个会话`);
        return sessions;
    }
    /**
     * 获取单个会话详情
     */
    async getSessionDetail(agentId) {
        if (!storage_1.sessionStorage.sessionExists(agentId)) {
            return null;
        }
        const meta = storage_1.sessionStorage.readMeta(agentId);
        const messages = storage_1.sessionStorage.readMessages(agentId);
        return {
            id: agentId,
            agentId,
            meta,
            messages: messages.map((msg, idx) => ({
                id: `${agentId}-msg-${idx}`,
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp || null
            }))
        };
    }
    /**
     * 删除会话
     */
    async deleteSession(agentId) {
        console.log(`[SessionService] 删除会话: ${agentId}`);
        if (!storage_1.sessionStorage.sessionExists(agentId)) {
            console.warn(`会话不存在: ${agentId}`);
            return false;
        }
        return storage_1.sessionStorage.deleteSession(agentId);
    }
    /**
     * 重命名会话
     */
    async renameSession(agentId, newName) {
        console.log(`[SessionService] 重命名会话: ${agentId} -> ${newName}`);
        if (!storage_1.sessionStorage.sessionExists(agentId)) {
            console.warn(`会话不存在: ${agentId}`);
            return false;
        }
        if (!newName || newName.trim().length === 0) {
            console.warn('新名称不能为空');
            return false;
        }
        return storage_1.sessionStorage.renameSession(agentId, newName.trim());
    }
    /**
     * 更新会话信息
     */
    async updateSession(agentId, options) {
        console.log(`[SessionService] 更新会话: ${agentId}`);
        if (!storage_1.sessionStorage.sessionExists(agentId)) {
            console.warn(`会话不存在: ${agentId}`);
            return false;
        }
        try {
            const meta = storage_1.sessionStorage.readMeta(agentId);
            // 更新自定义名称
            if (options.customName !== undefined) {
                meta.customName = options.customName;
            }
            // 更新其他元数据
            if (options.meta) {
                Object.assign(meta, options.meta);
            }
            storage_1.sessionStorage.writeMeta(agentId, meta);
            return true;
        }
        catch (error) {
            console.error(`更新会话失败 (${agentId}):`, error);
            return false;
        }
    }
    /**
     * 检查会话是否存在
     */
    sessionExists(agentId) {
        return storage_1.sessionStorage.sessionExists(agentId);
    }
    /**
     * 批量删除会话
     */
    async batchDeleteSessions(agentIds) {
        console.log(`[SessionService] 批量删除 ${agentIds.length} 个会话`);
        const success = [];
        const failed = [];
        for (const agentId of agentIds) {
            const result = await this.deleteSession(agentId);
            if (result) {
                success.push(agentId);
            }
            else {
                failed.push(agentId);
            }
        }
        console.log(`批量删除完成: 成功 ${success.length}, 失败 ${failed.length}`);
        return { success, failed };
    }
    /**
     * 获取会话统计
     */
    async getSessionStats(agentId) {
        if (!storage_1.sessionStorage.sessionExists(agentId)) {
            return null;
        }
        return storage_1.sessionStorage.getSessionStats(agentId);
    }
    /**
     * 加载单个会话（内部方法）
     */
    async loadSession(agentId) {
        const meta = storage_1.sessionStorage.readMeta(agentId);
        const messages = storage_1.sessionStorage.readMessages(agentId);
        // 优先使用自定义名称，否则自动生成
        const displayName = meta.customName || (0, auto_naming_1.generateSessionTitle)(messages);
        const session = {
            id: agentId,
            name: displayName,
            agentId,
            description: `${agentId} - ${messages.length}条消息`,
            type: 'backend',
            messagesCount: messages.length,
            createdAt: meta.created || null,
            updatedAt: meta.updated || null,
            isOnline: true,
            category: 'agent',
            messages: messages.map((msg, idx) => ({
                id: `${agentId}-msg-${idx}`,
                role: msg.role,
                content: (0, auto_naming_1.extractMessageContent)(msg.content),
                timestamp: msg.timestamp || null,
                dateTime: msg.timestamp ? new Date(msg.timestamp).toISOString() : null
            }))
        };
        return session;
    }
    /**
     * 排序会话列表
     */
    sortSessions(sessions, sortBy, order) {
        sessions.sort((a, b) => {
            let aVal;
            let bVal;
            switch (sortBy) {
                case 'createdAt':
                    aVal = a.createdAt || '';
                    bVal = b.createdAt || '';
                    break;
                case 'updatedAt':
                    aVal = a.updatedAt || '';
                    bVal = b.updatedAt || '';
                    break;
                case 'messagesCount':
                    aVal = a.messagesCount;
                    bVal = b.messagesCount;
                    break;
                case 'name':
                    aVal = a.name;
                    bVal = b.name;
                    break;
                default:
                    return 0;
            }
            if (aVal < bVal)
                return order === 'asc' ? -1 : 1;
            if (aVal > bVal)
                return order === 'asc' ? 1 : -1;
            return 0;
        });
    }
}
exports.SessionManagementService = SessionManagementService;
/**
 * 全局服务实例
 */
exports.sessionService = new SessionManagementService();
