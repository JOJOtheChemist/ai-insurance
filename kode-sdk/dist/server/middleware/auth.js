"use strict";
/**
 * JWT 认证中间件
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
exports.authenticateToken = authenticateToken;
exports.requireAdmin = requireAdmin;
exports.validateSessionOwnership = validateSessionOwnership;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jwt = __importStar(require("jsonwebtoken"));
// 🔥 统一使用AI时间管理系统的JWT密钥
// 同时支持 JWT_SECRET 和 JWT_SECRET_KEY 环境变量（与后端保持一致）
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || 'your-secret-key-here-change-in-production';
/**
 * 验证 JWT Token 中间件
 * 🔥 统一使用AI时间管理系统的JWT密钥
 */
function authenticateToken(req, res, next) {
    // 从请求头获取 token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            ok: false,
            error: '未提供认证令牌'
        });
    }
    try {
        // 验证Token（AI时间管理系统格式）
        const timesheetPayload = jwt.verify(token, JWT_SECRET);
        // AI时间管理系统的Token格式: { sub: user_id(数字), username: "yeya" }
        // 转换为统一格式，优先使用username作为userId
        const payload = {
            userId: timesheetPayload.username || String(timesheetPayload.sub),
            username: timesheetPayload.username || String(timesheetPayload.sub),
            role: 'user',
            email: timesheetPayload.email,
            timesheetUserId: timesheetPayload.sub // 保存原始数字ID
        };
        // 将用户信息附加到请求对象
        req.user = payload;
        console.log(`[Auth] ✅ 用户认证成功:`);
        console.log(`  - username: ${payload.username}`);
        console.log(`  - userId: ${payload.userId}`);
        console.log(`  - timesheetUserId: ${payload.timesheetUserId}`);
        console.log(`  - 原始Token payload:`, JSON.stringify(timesheetPayload, null, 2));
        next();
    }
    catch (error) {
        console.error('[Auth] ❌ Token验证失败:', error);
        return res.status(403).json({
            ok: false,
            error: '无效的认证令牌'
        });
    }
}
/**
 * 验证管理员权限中间件
 */
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            ok: false,
            error: '未认证'
        });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            ok: false,
            error: '需要管理员权限'
        });
    }
    console.log(`[Auth] 管理员权限验证通过: ${req.user.username}`);
    next();
}
/**
 * 验证会话所有权中间件
 * 确保用户只能访问自己的会话
 */
function validateSessionOwnership(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            ok: false,
            error: '未认证'
        });
    }
    const { agentId } = req.params;
    // 管理员可以访问所有会话
    if (req.user.role === 'admin') {
        console.log(`[Auth] 管理员访问会话: ${agentId}`);
        next();
        return;
    }
    // 普通用户：检查会话ID是否属于该用户
    // 会话ID格式：user-{userId}-{sessionName}
    const expectedPrefix = `user-${req.user.userId}-`;
    if (!agentId.startsWith(expectedPrefix)) {
        console.warn(`[Auth] 用户 ${req.user.userId} 尝试访问他人会话: ${agentId}`);
        return res.status(403).json({
            ok: false,
            error: '无权访问此会话'
        });
    }
    console.log(`[Auth] 会话所有权验证通过: ${req.user.username} -> ${agentId}`);
    next();
}
/**
 * 生成 JWT Token（用于登录）
 */
function generateToken(user) {
    return jwt.sign(user, JWT_SECRET, {
        expiresIn: '24h' // 24小时过期
    });
}
/**
 * 验证 Token（不作为中间件使用）
 * 🔥 统一使用AI时间管理系统的JWT密钥
 */
function verifyToken(token) {
    try {
        const timesheetPayload = jwt.verify(token, JWT_SECRET);
        // 转换为统一格式
        return {
            userId: timesheetPayload.username || String(timesheetPayload.sub),
            username: timesheetPayload.username || String(timesheetPayload.sub),
            role: 'user',
            email: timesheetPayload.email,
            timesheetUserId: timesheetPayload.sub
        };
    }
    catch (error) {
        return null;
    }
}
