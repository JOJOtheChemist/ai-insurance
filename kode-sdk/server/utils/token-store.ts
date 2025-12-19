/**
 * 用户Token存储
 * 用于在工具执行时访问当前用户的Token
 */

class TokenStore {
  private tokens: Map<string, string> = new Map();
  private sessionToUser: Map<string, string> = new Map(); // sessionId -> userId 映射

  /**
   * 存储用户的Token
   */
  set(userId: string, token: string) {
    this.tokens.set(userId, token);
  }

  /**
   * 获取用户的Token
   */
  get(userId: string): string | undefined {
    return this.tokens.get(userId);
  }

  /**
   * 移除用户的Token
   */
  remove(userId: string) {
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
  setSession(sessionId: string, userId: string) {
    this.sessionToUser.set(sessionId, userId);
    console.log(`[Token Store] 存储Session映射: ${sessionId} -> ${userId}`);
  }
  
  /**
   * 根据sessionId获取userId
   */
  getUserBySession(sessionId: string): string | undefined {
    return this.sessionToUser.get(sessionId);
  }
  
  /**
   * 删除session映射
   */
  removeSession(sessionId: string) {
    this.sessionToUser.delete(sessionId);
  }
}

export const tokenStore = new TokenStore();

