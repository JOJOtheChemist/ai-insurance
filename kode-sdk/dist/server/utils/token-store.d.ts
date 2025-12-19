/**
 * 用户Token存储
 * 用于在工具执行时访问当前用户的Token
 */
declare class TokenStore {
    private tokens;
    private sessionToUser;
    /**
     * 存储用户的Token
     */
    set(userId: string, token: string): void;
    /**
     * 获取用户的Token
     */
    get(userId: string): string | undefined;
    /**
     * 移除用户的Token
     */
    remove(userId: string): void;
    /**
     * 清空所有Token
     */
    clear(): void;
    /**
     * 存储 sessionId -> userId 映射
     */
    setSession(sessionId: string, userId: string): void;
    /**
     * 根据sessionId获取userId
     */
    getUserBySession(sessionId: string): string | undefined;
    /**
     * 删除session映射
     */
    removeSession(sessionId: string): void;
}
export declare const tokenStore: TokenStore;
export {};
