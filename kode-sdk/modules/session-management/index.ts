/**
 * 会话管理模块 - 统一导出
 * 
 * 只使用文件系统存储（.kode目录下）
 */

import { SessionManagementService } from './service';

// 注释掉 MongoDB 相关
// import { MongoDBSessionService } from './mongodb-service';

// 强制使用文件系统存储
console.log('[Session Management] 使用存储方式: 文件系统 (.kode 目录)');

// 只导出文件系统会话服务
export const sessionService = new SessionManagementService();

// 同时导出类型
export * from './types';
export { SessionManagementService } from './service';

// 注释掉 MongoDB 导出
// export { MongoDBSessionService } from './mongodb-service';
