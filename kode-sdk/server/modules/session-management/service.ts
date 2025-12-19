/**
 * 会话管理模块 - 主服务类
 */

import { sessionStorage } from './storage';
import { generateSessionTitle, extractMessageContent } from './auto-naming';
import { 
  Session, 
  SessionDetail, 
  SessionListOptions,
  UpdateSessionOptions 
} from './types';

/**
 * 会话管理服务类
 */
export class SessionManagementService {
  /**
   * 获取所有会话列表
   */
  async getAllSessions(options?: SessionListOptions): Promise<Session[]> {
    console.log('[SessionService] 获取会话列表...');
    
    const sessionIds = sessionStorage.getAllSessionIds();
    const sessions: Session[] = [];

    for (const agentId of sessionIds) {
      try {
        const session = await this.loadSession(agentId);
        if (session) {
          sessions.push(session);
        }
      } catch (error) {
        console.error(`✗ 加载会话失败 (${agentId}):`, error);
      }
    }

    // 排序
    if (options?.sortBy) {
      this.sortSessions(sessions, options.sortBy, options.sortOrder || 'desc');
    }

    console.log(`[SessionService] 成功加载 ${sessions.length} 个会话`);
    return sessions;
  }

  /**
   * 获取单个会话详情
   */
  async getSessionDetail(agentId: string): Promise<SessionDetail | null> {
    if (!sessionStorage.sessionExists(agentId)) {
      return null;
    }

    const meta = sessionStorage.readMeta(agentId);
    const messages = sessionStorage.readMessages(agentId);

    return {
      id: agentId,
      agentId,
      meta,
      messages: messages.map((msg: any, idx: number) => ({
        id: `${agentId}-msg-${idx}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || null
      }))
    };
  }

  /**
   * 删除会话
   */
  async deleteSession(agentId: string): Promise<boolean> {
    console.log(`[SessionService] 删除会话: ${agentId}`);
    
    if (!sessionStorage.sessionExists(agentId)) {
      console.warn(`会话不存在: ${agentId}`);
      return false;
    }

    return sessionStorage.deleteSession(agentId);
  }

  /**
   * 重命名会话
   */
  async renameSession(agentId: string, newName: string): Promise<boolean> {
    console.log(`[SessionService] 重命名会话: ${agentId} -> ${newName}`);
    
    if (!sessionStorage.sessionExists(agentId)) {
      console.warn(`会话不存在: ${agentId}`);
      return false;
    }

    if (!newName || newName.trim().length === 0) {
      console.warn('新名称不能为空');
      return false;
    }

    return sessionStorage.renameSession(agentId, newName.trim());
  }

  /**
   * 更新会话信息
   */
  async updateSession(agentId: string, options: UpdateSessionOptions): Promise<boolean> {
    console.log(`[SessionService] 更新会话: ${agentId}`);
    
    if (!sessionStorage.sessionExists(agentId)) {
      console.warn(`会话不存在: ${agentId}`);
      return false;
    }

    try {
      const meta = sessionStorage.readMeta(agentId);
      
      // 更新自定义名称
      if (options.customName !== undefined) {
        meta.customName = options.customName;
      }

      // 更新其他元数据
      if (options.meta) {
        Object.assign(meta, options.meta);
      }

      sessionStorage.writeMeta(agentId, meta);
      return true;
    } catch (error) {
      console.error(`更新会话失败 (${agentId}):`, error);
      return false;
    }
  }

  /**
   * 检查会话是否存在
   */
  sessionExists(agentId: string): boolean {
    return sessionStorage.sessionExists(agentId);
  }

  /**
   * 批量删除会话
   */
  async batchDeleteSessions(agentIds: string[]): Promise<{
    success: string[];
    failed: string[];
  }> {
    console.log(`[SessionService] 批量删除 ${agentIds.length} 个会话`);
    
    const success: string[] = [];
    const failed: string[] = [];

    for (const agentId of agentIds) {
      const result = await this.deleteSession(agentId);
      if (result) {
        success.push(agentId);
      } else {
        failed.push(agentId);
      }
    }

    console.log(`批量删除完成: 成功 ${success.length}, 失败 ${failed.length}`);
    return { success, failed };
  }

  /**
   * 获取会话统计
   */
  async getSessionStats(agentId: string) {
    if (!sessionStorage.sessionExists(agentId)) {
      return null;
    }

    return sessionStorage.getSessionStats(agentId);
  }

  /**
   * 加载单个会话（内部方法）
   */
  private async loadSession(agentId: string): Promise<Session | null> {
    const meta = sessionStorage.readMeta(agentId);
    const messages = sessionStorage.readMessages(agentId);

    // 优先使用自定义名称，否则自动生成
    const displayName = meta.customName || generateSessionTitle(messages);
    
    const session: Session = {
      id: agentId,
      name: displayName,
      agentId,
      description: `${agentId} - ${messages.length}条消息`,
      type: 'backend',
      messagesCount: messages.length,
      createdAt: meta.created || null,
      updatedAt: meta.updated || null,
      isOnline: true,
      category: 'agent',
      messages: messages.map((msg: any, idx: number) => ({
        id: `${agentId}-msg-${idx}`,
        role: msg.role,
        content: extractMessageContent(msg.content),
        timestamp: msg.timestamp || null,
        dateTime: msg.timestamp ? new Date(msg.timestamp).toISOString() : null
      }))
    };

    return session;
  }

  /**
   * 排序会话列表
   */
  private sortSessions(
    sessions: Session[], 
    sortBy: string, 
    order: 'asc' | 'desc'
  ): void {
    sessions.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case 'createdAt':
          aVal = a.createdAt || '';
          bVal = b.createdAt || '';
          break;
        case 'updatedAt':
          aVal = a.updatedAt || '';
          bVal = b.updatedAt || '';
          break;
        case 'messagesCount':
          aVal = a.messagesCount;
          bVal = b.messagesCount;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

/**
 * 全局服务实例
 */
export const sessionService = new SessionManagementService();

