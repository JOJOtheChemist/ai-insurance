/**
 * 用户级别的MCP客户端工厂
 * 根据用户ID获取对应的Token，创建MCP客户端
 */
import { MCPClient } from './client';
/**
 * 为当前用户创建MCP客户端
 * @param userId 用户ID（从工具上下文中获取）
 * @returns MCP客户端实例
 */
export declare function createUserMCPClient(userId?: string): MCPClient;
