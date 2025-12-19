/**
 * 会话管理模块 - 存储操作
 */

import * as fs from 'fs';
import * as path from 'path';
import { SessionMeta } from './types';

const KODE_DIR = path.join(process.cwd(), '.kode');

/**
 * 存储操作类
 */
export class SessionStorage {
  /**
   * 获取所有会话 ID
   */
  getAllSessionIds(): string[] {
    if (!fs.existsSync(KODE_DIR)) {
      return [];
    }

    return fs.readdirSync(KODE_DIR)
      .filter(item => {
        const itemPath = path.join(KODE_DIR, item);
        return fs.statSync(itemPath).isDirectory();
      });
  }

  /**
   * 检查会话是否存在
   */
  sessionExists(agentId: string): boolean {
    const agentPath = path.join(KODE_DIR, agentId);
    return fs.existsSync(agentPath);
  }

  /**
   * 获取会话路径
   */
  getSessionPath(agentId: string): string {
    return path.join(KODE_DIR, agentId);
  }

  /**
   * 读取会话元数据
   */
  readMeta(agentId: string): SessionMeta {
    const metaPath = path.join(KODE_DIR, agentId, 'meta.json');
    
    if (!fs.existsSync(metaPath)) {
      return {};
    }

    try {
      const metaData = fs.readFileSync(metaPath, 'utf-8');
      return JSON.parse(metaData);
    } catch (error) {
      console.error(`读取元数据失败 (${agentId}):`, error);
      return {};
    }
  }

  /**
   * 写入会话元数据
   */
  writeMeta(agentId: string, meta: SessionMeta): void {
    const metaPath = path.join(KODE_DIR, agentId, 'meta.json');
    
    // 确保目录存在
    const agentPath = path.join(KODE_DIR, agentId);
    if (!fs.existsSync(agentPath)) {
      fs.mkdirSync(agentPath, { recursive: true });
    }

    // 更新时间戳
    const updatedMeta = {
      ...meta,
      updated: new Date().toISOString()
    };

    fs.writeFileSync(metaPath, JSON.stringify(updatedMeta, null, 2), 'utf-8');
  }

  /**
   * 读取会话消息
   */
  readMessages(agentId: string): any[] {
    const messagesPath = path.join(KODE_DIR, agentId, 'runtime', 'messages.json');
    
    if (!fs.existsSync(messagesPath)) {
      return [];
    }

    try {
      const messagesData = fs.readFileSync(messagesPath, 'utf-8');
      return JSON.parse(messagesData);
    } catch (error) {
      console.error(`读取消息失败 (${agentId}):`, error);
      return [];
    }
  }

  /**
   * 删除会话
   */
  deleteSession(agentId: string): boolean {
    const agentPath = path.join(KODE_DIR, agentId);
    
    if (!fs.existsSync(agentPath)) {
      return false;
    }

    try {
      // 递归删除整个会话目录
      this.removeDirectory(agentPath);
      console.log(`✓ 会话已删除: ${agentId}`);
      return true;
    } catch (error) {
      console.error(`删除会话失败 (${agentId}):`, error);
      return false;
    }
  }

  /**
   * 递归删除目录
   */
  private removeDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(file => {
        const curPath = path.join(dirPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          this.removeDirectory(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  }

  /**
   * 重命名会话（更新自定义名称）
   */
  renameSession(agentId: string, newName: string): boolean {
    try {
      const meta = this.readMeta(agentId);
      meta.customName = newName;
      this.writeMeta(agentId, meta);
      console.log(`✓ 会话已重命名: ${agentId} -> ${newName}`);
      return true;
    } catch (error) {
      console.error(`重命名会话失败 (${agentId}):`, error);
      return false;
    }
  }

  /**
   * 获取会话统计信息
   */
  getSessionStats(agentId: string): {
    messagesCount: number;
    createdAt: string | null;
    updatedAt: string | null;
  } {
    const meta = this.readMeta(agentId);
    const messages = this.readMessages(agentId);

    return {
      messagesCount: messages.length,
      createdAt: meta.created || null,
      updatedAt: meta.updated || null
    };
  }
}

/**
 * 全局存储实例
 */
export const sessionStorage = new SessionStorage();

