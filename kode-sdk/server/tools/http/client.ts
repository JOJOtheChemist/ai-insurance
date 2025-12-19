/**
 * MCP client implementation
 */

import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { MCPClientConfig, JSONRPCRequest, JSONRPCResponse, MCPToolCallContent } from './types';
import { AuthManager } from './auth';
import { DEFAULT_MCP_CONFIG, TIMEOUT_CONFIG, API_ENDPOINTS } from './config';

type AxiosInstance = any;
type AxiosRequestConfig = any;
type AxiosResponse = any;
type AxiosError = any;

/**
 * MCP 服务器客户端（支持JWT认证）
 */
export class MCPClient {
  private client: AxiosInstance;
  private authClient: AxiosInstance;
  private authManager: AuthManager;
  private baseURL: string;
  private externalToken: string | null = null; // 外部传入的Token（来自时间表系统）

  constructor(config: Partial<MCPClientConfig> = {}, externalToken?: string) {
    const finalConfig = { ...DEFAULT_MCP_CONFIG, ...config };
    this.baseURL = finalConfig.baseURL;
    this.externalToken = externalToken || null;

    // MCP API 客户端
    this.client = axios.create({
      baseURL: finalConfig.baseURL,
      timeout: TIMEOUT_CONFIG.MCP_REQUEST,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 认证客户端
    this.authClient = axios.create({
      baseURL: finalConfig.baseURL,
      timeout: TIMEOUT_CONFIG.AUTH_REQUEST,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 创建认证管理器
    this.authManager = new AuthManager(
      finalConfig.username,
      finalConfig.password,
      this.authClient
    );

    // 设置拦截器
    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 自动添加 token 到请求头
    this.client.interceptors.request.use((config: AxiosRequestConfig) => {
      // 优先使用外部Token（来自时间表系统），其次使用自己登录的Token
      const token = this.externalToken || this.authManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // 🔥 从Token中提取user_id并添加到X-User-Id header（MCP需要）
        try {
          const decoded = jwt.decode(token) as any;
          if (decoded && decoded.sub) {
            // MCP期望X-User-Id是数字ID
            config.headers['X-User-Id'] = String(decoded.sub);
            console.log(`[MCP Client] 设置 X-User-Id: ${decoded.sub} (来自Token.sub)`);
          }
        } catch (error) {
          console.warn('[MCP Client] 无法从Token中解析user_id:', error);
        }
      }
      return config;
    });

    // 自动处理 401 错误，重新登录
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
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
      }
    );
  }

  /**
   * 登录
   */
  async login(): Promise<void> {
    return this.authManager.login();
  }

  /**
   * 登出
   */
  logout(): void {
    this.authManager.logout();
  }

  /**
   * 调用 MCP 工具（使用 JSON-RPC 2.0 格式）
   */
  async callTool(toolName: string, params: any): Promise<any> {
    // 如果使用外部Token，不需要通过authManager登录
    if (!this.externalToken) {
      await this.authManager.ensureAuthenticated();
    }

    try {
      const request: JSONRPCRequest = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: params,
        },
      };

      const response: any = await this.client.post(
        API_ENDPOINTS.MCP_CALL,
        request
      );

      // 解析 JSON-RPC 响应
      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      // 提取实际结果
      const content = response.data.result?.content?.[0] as MCPToolCallContent;
      if (content?.type === 'text' && content.text) {
        try {
          return JSON.parse(content.text);
        } catch {
          // 如果不是JSON，返回原文本
          return content.text;
        }
      }

      return response.data.result;
    } catch (error: any) {
      console.error(`[MCP Client] 调用 ${toolName} 失败:`, error.message);
      throw error;
    }
  }

  /**
   * 获取工具列表
   */
  async getTools(): Promise<any[]> {
    await this.authManager.ensureAuthenticated();
    const response = await this.client.get(API_ENDPOINTS.TOOLS_LIST);
    return response.data.tools || [];
  }

  /**
   * 健康检查
   */
  async health(): Promise<any> {
    const response = await this.authClient.get(API_ENDPOINTS.MCP_HEALTH);
    return response.data;
  }

  /**
   * 获取基础 URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

