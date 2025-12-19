"use strict";
/**
 * 用户级别的MCP客户端工厂
 * 根据用户ID获取对应的Token，创建MCP客户端
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserMCPClient = createUserMCPClient;
const client_1 = require("./client");
const token_store_1 = require("../../utils/token-store");
/**
 * 为当前用户创建MCP客户端
 * @param userId 用户ID（从工具上下文中获取）
 * @returns MCP客户端实例
 */
function createUserMCPClient(userId) {
    if (!userId) {
        console.warn('[MCP] 未提供用户ID，使用默认配置');
        return new client_1.MCPClient();
    }
    // 尝试获取用户的Token
    const userToken = token_store_1.tokenStore.get(userId);
    if (userToken) {
        console.log(`[MCP] 使用用户 ${userId} 的Token创建MCP客户端`);
        return new client_1.MCPClient({}, userToken);
    }
    else {
        console.warn(`[MCP] 未找到用户 ${userId} 的Token，使用默认配置`);
        return new client_1.MCPClient();
    }
}
