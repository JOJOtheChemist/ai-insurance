/**
 * 服务器配置管理
 */

import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '127.0.0.1',  // 默认只监听localhost，由nginx代理

  // AI 模型配置
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    modelId: process.env.ANTHROPIC_MODEL_ID || 'glm-4',
    baseUrl: process.env.ANTHROPIC_BASE_URL,
  },

  // Agent 配置
  agent: {
    toolTimeoutMs: 30000,
    maxToolConcurrency: 1,
    workDir: './workspace',
  },

  // 开发模式
  isDevelopment: process.env.NODE_ENV !== 'production',
} as const;

/**
 * 验证必需的配置项
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.ai.apiKey) {
    errors.push('ANTHROPIC_API_KEY 未配置');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

