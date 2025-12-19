/**
 * 健康检查路由
 */

import { Router, Request, Response } from 'express';
import { config } from '../config';
import { getAllTools } from '../tools';
import { getAllAgentConfigs } from '../agents';
import { agentManager } from '../services/agent-service';
import { generateToken, verifyToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/health
 * 健康检查和系统信息
 */
router.get('/health', (req, res) => {
  const tools = getAllTools();
  const agents = getAllAgentConfigs();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      model: config.ai.modelId,
      apiKey: config.ai.apiKey ? '已配置' : '未配置',
      port: config.port,
    },
    stats: {
      tools: {
        count: tools.length,
        names: tools.map(t => t.metadata.name),
      },
      agents: {
        count: agents.length,
        configs: agents.map(a => ({
          id: a.id,
          name: a.name,
          tools: a.tools,
        })),
        active: agentManager.getAllAgentIds(),
      },
    },
  });
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/auth/login', async (req: Request, res: Response) => {
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

export default router;

