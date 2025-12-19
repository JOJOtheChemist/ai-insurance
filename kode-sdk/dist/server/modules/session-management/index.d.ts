/**
 * 会话管理模块 - 统一导出
 *
 * 只使用文件系统存储（.kode目录下）
 */
import { SessionManagementService } from './service';
export declare const sessionService: SessionManagementService;
export * from './types';
export { SessionManagementService } from './service';
