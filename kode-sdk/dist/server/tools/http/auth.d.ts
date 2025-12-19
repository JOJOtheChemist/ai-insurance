/**
 * Authentication utilities for MCP client
 */
type AxiosInstance = any;
/**
 * 认证管理器
 */
export declare class AuthManager {
    private token;
    private username;
    private password;
    private authClient;
    constructor(username: string, password: string, authClient: AxiosInstance);
    /**
     * 获取当前 token
     */
    getToken(): string | null;
    /**
     * 设置 token
     */
    setToken(token: string): void;
    /**
     * 检查是否已认证
     */
    isAuthenticated(): boolean;
    /**
     * 登录获取 JWT Token
     */
    login(): Promise<void>;
    /**
     * 确保已登录
     */
    ensureAuthenticated(): Promise<void>;
    /**
     * 清除认证信息
     */
    logout(): void;
}
export {};
