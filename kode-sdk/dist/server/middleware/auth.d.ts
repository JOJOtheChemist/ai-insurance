/**
 * JWT 认证中间件
 */
import { Request, Response, NextFunction } from 'express';
/**
 * 用户信息接口
 */
export interface UserPayload {
    userId: string;
    username: string;
    role: 'admin' | 'user';
    email?: string;
    timesheetUserId?: number | string;
}
/**
 * 扩展 Express Request，添加 user 属性
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
/**
 * 验证 JWT Token 中间件
 * 🔥 统一使用AI时间管理系统的JWT密钥
 */
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * 验证管理员权限中间件
 */
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * 验证会话所有权中间件
 * 确保用户只能访问自己的会话
 */
export declare function validateSessionOwnership(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * 生成 JWT Token（用于登录）
 */
export declare function generateToken(user: UserPayload): string;
/**
 * 验证 Token（不作为中间件使用）
 * 🔥 统一使用AI时间管理系统的JWT密钥
 */
export declare function verifyToken(token: string): UserPayload | null;
