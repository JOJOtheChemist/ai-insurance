/**
 * Batch Edit Tool Template - Core Functions
 *
 * 批量编辑工具的核心功能模板
 * 包含：权限检查、备份、差异计算等通用功能
 */
import * as diff from 'diff';
/**
 * 检查操作权限
 */
export declare function checkPermission(operation: 'create' | 'update' | 'delete', filePath: string, ctx?: any): Promise<{
    allowed: boolean;
    reason?: string;
}>;
/**
 * 创建文件备份
 */
export declare function createBackup(filePath: string, backupDir?: string): Promise<string>;
/**
 * 恢复备份
 */
export declare function restoreBackup(filePath: string, backupPath: string): Promise<void>;
/**
 * 计算文本差异
 */
export declare function calculateDiff(before: string, after: string): {
    changes: diff.Change[];
    stats: {
        added: number;
        removed: number;
        unchanged: number;
        totalChanges: number;
    };
};
/**
 * 读取文件内容
 */
export declare function readFileContent(filePath: string): Promise<string>;
/**
 * 写入文件内容
 */
export declare function writeFileContent(filePath: string, content: string): Promise<void>;
