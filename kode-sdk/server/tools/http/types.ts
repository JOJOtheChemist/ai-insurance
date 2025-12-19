/**
 * HTTP client type definitions
 */

/**
 * MCP 客户端配置
 */
export interface MCPClientConfig {
  username: string;
  password: string;
  baseURL: string;
}

/**
 * JSON-RPC 2.0 请求
 */
export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: any;
}

/**
 * JSON-RPC 2.0 响应
 */
export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * MCP 工具调用参数
 */
export interface MCPToolCallParams {
  name: string;
  arguments: any;
}

/**
 * MCP 工具调用响应内容
 */
export interface MCPToolCallContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: any;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

