/**
 * HTTP client configuration
 */

import dotenv from 'dotenv';
import { MCPClientConfig } from './types';

// 确保环境变量已加载
dotenv.config();

/**
 * 默认 MCP 客户端配置
 */
export const DEFAULT_MCP_CONFIG: MCPClientConfig = {
  username: process.env.MCP_USERNAME || 'yeya',
  password: process.env.MCP_PASSWORD || 'yeya',
  baseURL: process.env.MCP_BASE_URL || 'http://140.143.194.215/mcp',
};

/**
 * HTTP 请求超时配置（毫秒）
 */
export const TIMEOUT_CONFIG = {
  MCP_REQUEST: 30000,  // 30秒
  AUTH_REQUEST: 10000, // 10秒
};

/**
 * API 端点配置
 */
export const API_ENDPOINTS = {
  MCP_BASE: '/mcp',
  MCP_CALL: '/',  // MCP服务器监听根路径
  MCP_HEALTH: '/health',
  AUTH_LOGIN: 'http://140.143.194.215/api/auth/login',  // 🔥 登录端点在时间表后端（公网）
  TOOLS_LIST: '/',  // 工具列表也在根路径
};

