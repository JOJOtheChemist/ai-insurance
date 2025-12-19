/**
 * 用户级别的MCP客户端工厂
 * 根据用户ID获取对应的Token，创建MCP客户端
 */

import { MCPClient } from './client';
import { tokenStore } from '../../utils/token-store';

/**
 * 为当前用户创建MCP客户端
 * @param userId 用户ID（从工具上下文中获取）
 * @returns MCP客户端实例
 */
export function createUserMCPClient(userId?: string): MCPClient {
  if (!userId) {
    console.warn('[MCP] 未提供用户ID，使用默认配置');
    return new MCPClient();
  }

  // 尝试获取用户的Token
  const userToken = tokenStore.get(userId);
  
  if (userToken) {
    console.log(`[MCP] 使用用户 ${userId} 的Token创建MCP客户端`);
    return new MCPClient({}, userToken);
  } else {
    console.warn(`[MCP] 未找到用户 ${userId} 的Token，使用默认配置`);
    return new MCPClient();
  }
}

