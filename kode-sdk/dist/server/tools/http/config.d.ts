/**
 * HTTP client configuration
 */
import { MCPClientConfig } from './types';
/**
 * 默认 MCP 客户端配置
 */
export declare const DEFAULT_MCP_CONFIG: MCPClientConfig;
/**
 * HTTP 请求超时配置（毫秒）
 */
export declare const TIMEOUT_CONFIG: {
    MCP_REQUEST: number;
    AUTH_REQUEST: number;
};
/**
 * API 端点配置
 */
export declare const API_ENDPOINTS: {
    MCP_BASE: string;
    MCP_CALL: string;
    MCP_HEALTH: string;
    AUTH_LOGIN: string;
    TOOLS_LIST: string;
};
