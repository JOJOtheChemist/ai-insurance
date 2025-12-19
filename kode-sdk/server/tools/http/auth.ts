/**
 * Authentication utilities for MCP client
 */

import axios from 'axios';
import { AuthResponse } from './types';
import { API_ENDPOINTS } from './config';

type AxiosInstance = any;

/**
 * 认证管理器
 */
export class AuthManager {
  private token: string | null = null;
  private username: string;
  private password: string;
  private authClient: AxiosInstance;

  constructor(username: string, password: string, authClient: AxiosInstance) {
    this.username = username;
    this.password = password;
    this.authClient = authClient;
  }

  /**
   * 获取当前 token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * 设置 token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /**
   * 登录获取 JWT Token
   */
  async login(): Promise<void> {
    try {
      const response: any = await this.authClient.post(
        API_ENDPOINTS.AUTH_LOGIN,
        {
          username: this.username,
          password: this.password,
        }
      );

      this.token = response.data.access_token;
      console.log(`[MCP Client] ✓ 登录成功: ${this.username}`);
    } catch (error: any) {
      console.error('[MCP Client] ✗ 登录失败:', error.message);
      throw new Error('MCP 认证失败');
    }
  }

  /**
   * 确保已登录
   */
  async ensureAuthenticated(): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.login();
    }
  }

  /**
   * 清除认证信息
   */
  logout(): void {
    this.token = null;
    console.log('[MCP Client] 已登出');
  }
}

