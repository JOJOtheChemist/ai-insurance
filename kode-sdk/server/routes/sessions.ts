/**
 * 会话管理路由 - HTTP 请求处理层
 */

import { Router } from 'express';
import { multiUserStorage } from '../../modules/session-management/multi-user-storage';
import { generateSessionTitle, extractMessageContent } from '../../modules/session-management/auto-naming';
import { formatMessagesForFrontend } from '../modules/session-management/message-formatter';
import { authenticateToken, generateToken } from '../middleware/auth';

const router = Router();

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
      role: 'user' as const,
      email: `${username}@example.com`
    };

    // 生成JWT token
    const access_token = generateToken(user);

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
  } catch (error: any) {
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
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    // 从JWT token获取用户ID
    const userId = req.user?.userId || req.query.userId as string;

    console.log(`[会话API] 🔍 获取会话列表请求:`);
    console.log(`  - 来自JWT的userId: ${req.user?.userId}`);
    console.log(`  - 来自query的userId: ${req.query.userId}`);
    console.log(`  - 最终使用的userId: ${userId}`);
    console.log(`  - req.user对象:`, JSON.stringify(req.user, null, 2));

    const sessionIds = multiUserStorage.getAllSessionIds(userId);
    console.log(`[会话API] 📋 找到 ${sessionIds.length} 个会话ID:`, sessionIds);

    const sessions: any[] = [];

    for (const agentId of sessionIds) {
      try {
        const meta = multiUserStorage.readMeta(userId, agentId);
        const messages = multiUserStorage.readMessages(userId, agentId);
        const autoTitle = meta.customName || generateSessionTitle(messages);

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
          messages: messages.map((msg: any, idx: number) => ({
            id: `${agentId}-msg-${idx}`,
            role: msg.role,
            content: extractMessageContent(msg.content),
            timestamp: msg.timestamp || null,
            dateTime: msg.timestamp ? new Date(msg.timestamp).toISOString() : null
          }))
        });
      } catch (error) {
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
  } catch (error: any) {
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
router.get('/sessions/:agentId', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;
    const userId = req.user?.userId || req.query.userId as string;

    console.log(`[Sessions Route Debug] Request for session: ${agentId}`);
    console.log(`[Sessions Route Debug] User ID resolved to: ${userId}`);
    console.log(`[Sessions Route Debug] Auth header present: ${!!req.headers['authorization']}`);
    console.log(`[Sessions Route Debug] req.user: ${JSON.stringify(req.user)}`);

    if (!multiUserStorage.sessionExists(userId, agentId)) {
      console.error(`[Sessions Route Debug] Session NOT found at path: .kode/${userId}/${agentId}`);
      // Fallback checkout for "admin" or other common IDs if debugging
      return res.status(404).json({
        ok: false,
        error: `会话 ${agentId} 不存在 (User: ${userId})`
      });
    }

    const meta = multiUserStorage.readMeta(userId, agentId);
    const messages = multiUserStorage.readMessages(userId, agentId);

    console.log(`[会话详情API] ✅ 找到会话:`);
    console.log(`  - 消息数量: ${messages.length}`);
    console.log(`  - 会话名称: ${meta.customName || '未命名'}`);

    // 🔥 Format messages for frontend (includes tool calls)
    const formattedMessages = formatMessagesForFrontend(messages);
    console.log(`[会话详情API] 🎨 消息格式化完成: ${formattedMessages.length} 条`);

    res.json({
      ok: true,
      session: {
        id: agentId,
        name: meta.customName || generateSessionTitle(messages),
        agentId,
        messages: formattedMessages,
        createdAt: meta.createdAt || meta.created,
        updatedAt: meta.updatedAt || meta.updated,
        messagesCount: messages.length
      }
    });
  } catch (error: any) {
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
router.delete('/sessions/:agentId', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;
    const userId = req.user?.userId || req.query.userId as string;

    if (!multiUserStorage.sessionExists(userId, agentId)) {
      return res.status(404).json({
        ok: false,
        error: `会话 ${agentId} 不存在`
      });
    }

    const deleted = multiUserStorage.deleteSession(userId, agentId);

    if (deleted) {
      res.json({
        ok: true,
        message: `会话 ${agentId} 已删除`
      });
    } else {
      res.status(500).json({
        ok: false,
        error: `删除会话 ${agentId} 失败`
      });
    }
  } catch (error: any) {
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
router.put('/sessions/:agentId/rename', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;
    const { newName } = req.body;
    const userId = req.user?.userId || req.query.userId as string;

    if (!newName || newName.trim() === '') {
      return res.status(400).json({
        ok: false,
        error: '新名称不能为空'
      });
    }

    if (!multiUserStorage.sessionExists(userId, agentId)) {
      return res.status(404).json({
        ok: false,
        error: `会话 ${agentId} 不存在`
      });
    }

    const renamed = multiUserStorage.renameSession(userId, agentId, newName.trim());

    if (renamed) {
      res.json({
        ok: true,
        message: `会话已重命名为: ${newName.trim()}`
      });
    } else {
      res.status(500).json({
        ok: false,
        error: `重命名会话 ${agentId} 失败`
      });
    }
  } catch (error: any) {
    console.error('[Sessions API] 重命名会话失败:', error);
    res.status(500).json({
      ok: false,
      error: error.message || '重命名会话失败'
    });
  }
});

export default router;