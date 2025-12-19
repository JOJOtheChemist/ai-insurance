"use strict";
/**
 * 用户Token存储
 * 用于在工具执行时访问当前用户的Token
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenStore = void 0;
class TokenStore {
    constructor() {
        this.tokens = new Map();
        this.sessionToUser = new Map(); // sessionId -> userId 映射
    }
    /**
     * 存储用户的Token
     */
    set(userId, token) {
        this.tokens.set(userId, token);
    }
    /**
     * 获取用户的Token
     */
    get(userId) {
        return this.tokens.get(userId);
    }
    /**
     * 移除用户的Token
     */
    remove(userId) {
        this.tokens.delete(userId);
    }
    /**
     * 清空所有Token
     */
    clear() {
        this.tokens.clear();
    }
    /**
     * 存储 sessionId -> userId 映射
     */
    setSession(sessionId, userId) {
        this.sessionToUser.set(sessionId, userId);
        console.log(`[Token Store] 存储Session映射: ${sessionId} -> ${userId}`);
    }
    /**
     * 根据sessionId获取userId
     */
    getUserBySession(sessionId) {
        return this.sessionToUser.get(sessionId);
    }
    /**
     * 删除session映射
     */
    removeSession(sessionId) {
        this.sessionToUser.delete(sessionId);
    }
}
exports.tokenStore = new TokenStore();
