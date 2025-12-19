"use strict";
/**
 * 会话管理路由 - HTTP 请求处理层
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multi_user_storage_1 = require("../../modules/session-management/multi-user-storage");
const auto_naming_1 = require("../../modules/session-management/auto-naming");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                ok: false,
                error: '用户名和密码不能为空'
            });
        }
        // 简单的用户验证（生产环境应该连接数据库）
        const user = {
            userId: username,
            username: username,
            role: 'user',
            email: `${username}@example.com`
        };
        // 生成JWT token
        const access_token = (0, auth_1.generateToken)(user);
        console.log(`[Auth] 用户登录成功: ${username}`);
        res.json({
            ok: true,
            access_token,
            token: access_token, // 兼容性
            user: {
                userId: user.userId,
                username: user.username,
                role: user.role,
                email: user.email
            },
            message: '登录成功'
        });
    }
    catch (error) {
        console.error('[Auth] 登录失败:', error);
        res.status(500).json({
            ok: false,
            error: '登录失败',
            message: error.message
        });
    }
});
/**
 * 获取用户的所有会话列表
 * GET /api/sessions
 */
router.get('/sessions', auth_1.authenticateToken, async (req, res) => {
    try {
        // 从JWT token获取用户ID
        const userId = req.user?.userId || req.query.userId;
        console.log(`[会话API] 🔍 获取会话列表请求:`);
        console.log(`  - 来自JWT的userId: ${req.user?.userId}`);
        console.log(`  - 来自query的userId: ${req.query.userId}`);
        console.log(`  - 最终使用的userId: ${userId}`);
        console.log(`  - req.user对象:`, JSON.stringify(req.user, null, 2));
        const sessionIds = multi_user_storage_1.multiUserStorage.getAllSessionIds(userId);
        console.log(`[会话API] 📋 找到 ${sessionIds.length} 个会话ID:`, sessionIds);
        const sessions = [];
        for (const agentId of sessionIds) {
            try {
                const meta = multi_user_storage_1.multiUserStorage.readMeta(userId, agentId);
                const messages = multi_user_storage_1.multiUserStorage.readMessages(userId, agentId);
                const autoTitle = meta.customName || (0, auto_naming_1.generateSessionTitle)(messages);
                sessions.push({
                    id: agentId,
                    name: autoTitle,
                    agentId,
                    description: `${agentId} - ${messages.length}条消息`,
                    type: 'backend',
                    messagesCount: messages.length,
                    createdAt: meta.createdAt || meta.created || null,
                    updatedAt: meta.updatedAt || meta.updated || null,
                    isOnline: true,
                    category: 'agent',
                    userId: meta.userId || userId,
                    messages: messages.map((msg, idx) => ({
                        id: `${agentId}-msg-${idx}`,
                        role: msg.role,
                        content: (0, auto_naming_1.extractMessageContent)(msg.content),
                        timestamp: msg.timestamp || null,
                        dateTime: msg.timestamp ? new Date(msg.timestamp).toISOString() : null
                    }))
                });
            }
            catch (error) {
                console.error(`读取会话失败 (${agentId}):`, error);
            }
        }
        res.json({
            ok: true,
            sessions,
            total: sessions.length,
            userId,
            message: sessions.length > 0
                ? `成功读取 ${sessions.length} 个会话 (用户: ${userId})`
                : `暂无会话数据 (用户: ${userId})`
        });
    }
    catch (error) {
        console.error('[会话列表] 获取失败:', error);
        res.status(500).json({
            ok: false,
            error: '获取会话列表失败',
            message: error.message
        });
    }
});
/**
 * 获取单个会话的详细信息
 * GET /api/sessions/:agentId
 */
router.get('/sessions/:agentId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { agentId } = req.params;
        const userId = req.user?.userId || req.query.userId;
        console.log(`[会话详情API] 🔍 获取会话详情请求:`);
        console.log(`  - agentId: ${agentId}`);
        console.log(`  - userId: ${userId}`);
        console.log(`  - 来自JWT的userId: ${req.user?.userId}`);
        console.log(`  - 来自query的userId: ${req.query.userId}`);
        if (!multi_user_storage_1.multiUserStorage.sessionExists(userId, agentId)) {
            console.log(`[会话详情API] ⚠️ 会话不存在: ${userId}/${agentId}`);
            return res.status(404).json({
                ok: false,
                error: `会话 ${agentId} 不存在`
            });
        }
        const meta = multi_user_storage_1.multiUserStorage.readMeta(userId, agentId);
        const messages = multi_user_storage_1.multiUserStorage.readMessages(userId, agentId);
        console.log(`[会话详情API] ✅ 找到会话:`);
        console.log(`  - 消息数量: ${messages.length}`);
        console.log(`  - 会话名称: ${meta.customName || '未命名'}`);
        res.json({
            ok: true,
            session: {
                id: agentId,
                name: meta.customName || (0, auto_naming_1.generateSessionTitle)(messages),
                agentId,
                messages,
                createdAt: meta.createdAt || meta.created,
                updatedAt: meta.updatedAt || meta.updated,
                messagesCount: messages.length
            }
        });
    }
    catch (error) {
        console.error('[Sessions API] 获取会话详情失败:', error);
        res.status(500).json({
            ok: false,
            error: error.message || '读取会话详情失败'
        });
    }
});
/**
 * 删除会话
 * DELETE /api/sessions/:agentId
 */
router.delete('/sessions/:agentId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { agentId } = req.params;
        const userId = req.user?.userId || req.query.userId;
        if (!multi_user_storage_1.multiUserStorage.sessionExists(userId, agentId)) {
            return res.status(404).json({
                ok: false,
                error: `会话 ${agentId} 不存在`
            });
        }
        const deleted = multi_user_storage_1.multiUserStorage.deleteSession(userId, agentId);
        if (deleted) {
            res.json({
                ok: true,
                message: `会话 ${agentId} 已删除`
            });
        }
        else {
            res.status(500).json({
                ok: false,
                error: `删除会话 ${agentId} 失败`
            });
        }
    }
    catch (error) {
        console.error('[Sessions API] 删除会话失败:', error);
        res.status(500).json({
            ok: false,
            error: error.message || '删除会话失败'
        });
    }
});
/**
 * 重命名会话
 * PUT /api/sessions/:agentId/rename
 */
router.put('/sessions/:agentId/rename', auth_1.authenticateToken, async (req, res) => {
    try {
        const { agentId } = req.params;
        const { newName } = req.body;
        const userId = req.user?.userId || req.query.userId;
        if (!newName || newName.trim() === '') {
            return res.status(400).json({
                ok: false,
                error: '新名称不能为空'
            });
        }
        if (!multi_user_storage_1.multiUserStorage.sessionExists(userId, agentId)) {
            return res.status(404).json({
                ok: false,
                error: `会话 ${agentId} 不存在`
            });
        }
        const renamed = multi_user_storage_1.multiUserStorage.renameSession(userId, agentId, newName.trim());
        if (renamed) {
            res.json({
                ok: true,
                message: `会话已重命名为: ${newName.trim()}`
            });
        }
        else {
            res.status(500).json({
                ok: false,
                error: `重命名会话 ${agentId} 失败`
            });
        }
    }
    catch (error) {
        console.error('[Sessions API] 重命名会话失败:', error);
        res.status(500).json({
            ok: false,
            error: error.message || '重命名会话失败'
        });
    }
});
exports.default = router;
