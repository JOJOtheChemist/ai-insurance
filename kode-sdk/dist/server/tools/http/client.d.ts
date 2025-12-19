/**
 * MCP client implementation
 */
import { MCPClientConfig } from './types';
/**
 * MCP 服务器客户端（支持JWT认证）
 */
export declare class MCPClient {
    private client;
    private authClient;
    private authManager;
    private baseURL;
    private externalToken;
    constructor(config?: Partial<MCPClientConfig>, externalToken?: string);
    /**
     * 设置请求和响应拦截器
     */
    private setupInterceptors;
    /**
     * 登录
     */
    login(): Promise<void>;
    /**
     * 登出
     */
    logout(): void;
    /**
     * 调用 MCP 工具（使用 JSON-RPC 2.0 格式）
     */
    callTool(toolName: string, params: any): Promise<any>;
    /**
     * 获取工具列表
     */
    getTools(): Promise<any[]>;
    /**
     * 健康检查
     */
    health(): Promise<any>;
    /**
     * 获取基础 URL
     */
    getBaseURL(): string;
}
