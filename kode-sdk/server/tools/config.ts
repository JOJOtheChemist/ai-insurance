/**
 * 工具统一配置文件
 * 
 * 用于统一管理 JWT 认证、API 地址等配置
 * 如果需要修改后端 API 地址，只需在此文件或环境变量中修改一次即可
 */

import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 后端 API 配置
 */
export const API_CONFIG = {
  /**
   * 主后端 API 地址
   * 
   * 可以通过环境变量 BACKEND_API_URL 修改
   * 默认值: http://localhost:8000
   */
  BASE_URL: process.env.BACKEND_API_URL || 'http://localhost:8080',

  /**
   * API 请求超时时间（毫秒）
   */
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000', 10),

  /**
   * API 版本
   */
  VERSION: 'v1',
};

/**
 * JWT 认证配置
 */
export const AUTH_CONFIG = {
  /**
   * 从环境变量获取默认用户 JWT Token
   * （可选，主要用于测试）
   */
  DEFAULT_USER_TOKEN: process.env.USER_JWT_TOKEN,

  /**
   * Token 过期时间检查（毫秒）
   */
  TOKEN_EXPIRY_BUFFER: parseInt(process.env.TOKEN_EXPIRY_BUFFER || '300000', 10), // 5分钟
};

/**
 * GLM AI 配置（用于自然语言解析）
 */
export const GLM_CONFIG = {
  /**
   * GLM API Key
   */
  API_KEY: process.env.GLM_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN || '',

  /**
   * GLM API 地址
   */
  BASE_URL: process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',

  /**
   * 使用的模型
   */
  MODEL: process.env.GLM_MODEL || 'glm-4.5-air',

  /**
   * 默认温度参数
   */
  TEMPERATURE: parseFloat(process.env.GLM_TEMPERATURE || '0.7'),

  /**
   * 最大 token 数
   */
  MAX_TOKENS: parseInt(process.env.GLM_MAX_TOKENS || '1000', 10),
};

/**
 * 工具通用配置
 */
export const TOOL_CONFIG = {
  /**
   * 默认最大重试次数
   */
  MAX_RETRY: parseInt(process.env.TOOL_MAX_RETRY || '3', 10),

  /**
   * 重试间隔（毫秒）
   */
  RETRY_INTERVAL: parseInt(process.env.TOOL_RETRY_INTERVAL || '1000', 10),

  /**
   * 是否启用调试日志
   */
  DEBUG: process.env.TOOL_DEBUG === 'true',
};

/**
 * 获取完整的 API URL
 * @param endpoint API 端点，例如 '/api/v1/tasks'
 * @returns 完整的 URL
 */
export function getApiUrl(endpoint: string): string {
  // 确保 endpoint 以 / 开头
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
}

/**
 * 获取 Authorization header
 * @param token JWT token
 * @returns Authorization header 字符串
 */
export function getAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

/**
 * 获取通用请求 headers
 * @param token JWT token
 * @returns 请求 headers 对象
 */
export function getRequestHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': getAuthHeader(token),
  };
}

/**
 * 从 JWT Token 解析用户 ID
 * @param token JWT token
 * @returns 用户 ID，解析失败返回 null
 */
export function parseUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    // 支持多种字段名：user_id, user_id (后端使用), sub (标准JWT)
    return payload.user_id || payload.sub || null;
  } catch (e) {
    console.error('[配置] 无法从 JWT 解析用户ID:', e);
    return null;
  }
}

/**
 * 打印当前配置（用于调试）
 */
export function printConfig(): void {
  console.log('\n' + '='.repeat(70));
  console.log('📋 工具配置信息');
  console.log('='.repeat(70));
  console.log(`后端 API 地址: ${API_CONFIG.BASE_URL}`);
  console.log(`API 超时时间: ${API_CONFIG.TIMEOUT}ms`);
  console.log(`GLM 模型: ${GLM_CONFIG.MODEL}`);
  console.log(`GLM API 地址: ${GLM_CONFIG.BASE_URL}`);
  console.log(`调试模式: ${TOOL_CONFIG.DEBUG ? '开启' : '关闭'}`);
  console.log(`默认重试次数: ${TOOL_CONFIG.MAX_RETRY}`);
  console.log('='.repeat(70) + '\n');
}

// 导出所有配置
export default {
  API_CONFIG,
  AUTH_CONFIG,
  GLM_CONFIG,
  TOOL_CONFIG,
  getApiUrl,
  getAuthHeader,
  getRequestHeaders,
  parseUserIdFromToken,
  printConfig,
};

