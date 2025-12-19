"use strict";
/**
 * MCP client implementation
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPClient = void 0;
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = require("./auth");
const config_1 = require("./config");
/**
 * MCP 服务器客户端（支持JWT认证）
 */
class MCPClient {
    constructor(config = {}, externalToken) {
        this.externalToken = null; // 外部传入的Token（来自时间表系统）
        const finalConfig = { ...config_1.DEFAULT_MCP_CONFIG, ...config };
        this.baseURL = finalConfig.baseURL;
        this.externalToken = externalToken || null;
        // MCP API 客户端
        this.client = axios_1.default.create({
            baseURL: finalConfig.baseURL,
            timeout: config_1.TIMEOUT_CONFIG.MCP_REQUEST,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // 认证客户端
        this.authClient = axios_1.default.create({
            baseURL: finalConfig.baseURL,
            timeout: config_1.TIMEOUT_CONFIG.AUTH_REQUEST,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // 创建认证管理器
        this.authManager = new auth_1.AuthManager(finalConfig.username, finalConfig.password, this.authClient);
        // 设置拦截器
        this.setupInterceptors();
    }
    /**
     * 设置请求和响应拦截器
     */
    setupInterceptors() {
        // 自动添加 token 到请求头
        this.client.interceptors.request.use((config) => {
            // 优先使用外部Token（来自时间表系统），其次使用自己登录的Token
            const token = this.externalToken || this.authManager.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                // 🔥 从Token中提取user_id并添加到X-User-Id header（MCP需要）
                try {
                    const decoded = jwt.decode(token);
                    if (decoded && decoded.sub) {
                        // MCP期望X-User-Id是数字ID
                        config.headers['X-User-Id'] = String(decoded.sub);
                        console.log(`[MCP Client] 设置 X-User-Id: ${decoded.sub} (来自Token.sub)`);
                    }
                }
                catch (error) {
                    console.warn('[MCP Client] 无法从Token中解析user_id:', error);
                }
            }
            return config;
        });
        // 自动处理 401 错误，重新登录
        this.client.interceptors.response.use((response) => response, async (error) => {
            if (error.response?.status === 401) {
                // 如果使用的是外部Token，不自动重新登录（外部Token失效需要用户重新登录）
                if (this.externalToken) {
                    console.error('[MCP Client] 外部Token失效，请用户重新登录');
                    return Promise.reject(error);
                }
                // 使用自己的Token时，尝试重新登录
                console.log('[MCP Client] Token 过期，重新登录...');
                await this.authManager.login();
                // 重试原请求
                const token = this.authManager.getToken();
                if (error.config) {
                    error.config.headers.Authorization = `Bearer ${token}`;
                    return this.client.request(error.config);
                }
            }
            return Promise.reject(error);
        });
    }
    /**
     * 登录
     */
    async login() {
        return this.authManager.login();
    }
    /**
     * 登出
     */
    logout() {
        this.authManager.logout();
    }
    /**
     * 调用 MCP 工具（使用 JSON-RPC 2.0 格式）
     */
    async callTool(toolName, params) {
        // 如果使用外部Token，不需要通过authManager登录
        if (!this.externalToken) {
            await this.authManager.ensureAuthenticated();
        }
        try {
            const request = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: toolName,
                    arguments: params,
                },
            };
            const response = await this.client.post(config_1.API_ENDPOINTS.MCP_CALL, request);
            // 解析 JSON-RPC 响应
            if (response.data.error) {
                throw new Error(response.data.error.message);
            }
            // 提取实际结果
            const content = response.data.result?.content?.[0];
            if (content?.type === 'text' && content.text) {
                try {
                    return JSON.parse(content.text);
                }
                catch {
                    // 如果不是JSON，返回原文本
                    return content.text;
                }
            }
            return response.data.result;
        }
        catch (error) {
            console.error(`[MCP Client] 调用 ${toolName} 失败:`, error.message);
            throw error;
        }
    }
    /**
     * 获取工具列表
     */
    async getTools() {
        await this.authManager.ensureAuthenticated();
        const response = await this.client.get(config_1.API_ENDPOINTS.TOOLS_LIST);
        return response.data.tools || [];
    }
    /**
     * 健康检查
     */
    async health() {
        const response = await this.authClient.get(config_1.API_ENDPOINTS.MCP_HEALTH);
        return response.data;
    }
    /**
     * 获取基础 URL
     */
    getBaseURL() {
        return this.baseURL;
    }
}
exports.MCPClient = MCPClient;
