"use strict";
/**
 * Authentication utilities for MCP client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
const config_1 = require("./config");
/**
 * 认证管理器
 */
class AuthManager {
    constructor(username, password, authClient) {
        this.token = null;
        this.username = username;
        this.password = password;
        this.authClient = authClient;
    }
    /**
     * 获取当前 token
     */
    getToken() {
        return this.token;
    }
    /**
     * 设置 token
     */
    setToken(token) {
        this.token = token;
    }
    /**
     * 检查是否已认证
     */
    isAuthenticated() {
        return this.token !== null;
    }
    /**
     * 登录获取 JWT Token
     */
    async login() {
        try {
            const response = await this.authClient.post(config_1.API_ENDPOINTS.AUTH_LOGIN, {
                username: this.username,
                password: this.password,
            });
            this.token = response.data.access_token;
            console.log(`[MCP Client] ✓ 登录成功: ${this.username}`);
        }
        catch (error) {
            console.error('[MCP Client] ✗ 登录失败:', error.message);
            throw new Error('MCP 认证失败');
        }
    }
    /**
     * 确保已登录
     */
    async ensureAuthenticated() {
        if (!this.isAuthenticated()) {
            await this.login();
        }
    }
    /**
     * 清除认证信息
     */
    logout() {
        this.token = null;
        console.log('[MCP Client] 已登出');
    }
}
exports.AuthManager = AuthManager;
