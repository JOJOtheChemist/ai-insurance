/**
 * 认证路由 - 登录、注册、JWT管理
 */

import { Router, Request, Response } from 'express';
import { generateToken, verifyToken } from '../middleware/auth';

const router = Router();

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: '用户名和密码不能为空'
      });
    }

    // 简单的用户验证（生产环境应该连接数据库）
    // 这里为了测试，接受任何用户名密码组合
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
 * 验证Token
 * GET /api/auth/verify
 */
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: '未提供认证令牌'
      });
    }

    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: '无效的认证令牌'
      });
    }

    res.json({
      ok: true,
      user,
      message: 'Token验证成功'
    });
  } catch (error: any) {
    console.error('[Auth] Token验证失败:', error);
    res.status(401).json({
      ok: false,
      error: 'Token验证失败',
      message: error.message
    });
  }
});

/**
 * 用户注册（可选功能）
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: '用户名和密码不能为空'
      });
    }

    // 简单的用户创建（生产环境应该连接数据库）
    const user = {
      userId: username,
      username: username,
      role: 'user' as const,
      email: email || `${username}@example.com`
    };

    // 生成JWT token
    const access_token = generateToken(user);

    console.log(`[Auth] 用户注册成功: ${username}`);

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
      message: '注册成功'
    });
  } catch (error: any) {
    console.error('[Auth] 注册失败:', error);
    res.status(500).json({
      ok: false,
      error: '注册失败',
      message: error.message
    });
  }
});

export default router;
