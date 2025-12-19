"use strict";
/**
 * 健康检查路由
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = require("../config");
const tools_1 = require("../tools");
const agents_1 = require("../agents");
const agent_service_1 = require("../services/agent-service");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * GET /api/health
 * 健康检查和系统信息
 */
router.get('/health', (req, res) => {
    const tools = (0, tools_1.getAllTools)();
    const agents = (0, agents_1.getAllAgentConfigs)();
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        config: {
            model: config_1.config.ai.modelId,
            apiKey: config_1.config.ai.apiKey ? '已配置' : '未配置',
            port: config_1.config.port,
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
                active: agent_service_1.agentManager.getAllAgentIds(),
            },
        },
    });
});
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
exports.default = router;
