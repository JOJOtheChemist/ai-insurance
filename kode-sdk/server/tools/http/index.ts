/**
 * HTTP client exports
 */

import { MCPClient } from './client';
import { DEFAULT_MCP_CONFIG } from './config';

// 默认实例（从环境变量读取用户名密码）
export const mcpClient = new MCPClient(DEFAULT_MCP_CONFIG);

// 导出所有类型和类
export * from './types';
export * from './config';
export * from './auth';
export * from './client';
