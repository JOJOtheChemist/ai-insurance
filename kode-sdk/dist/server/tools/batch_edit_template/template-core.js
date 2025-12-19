"use strict";
/**
 * Batch Edit Tool Template - Core Functions
 *
 * 批量编辑工具的核心功能模板
 * 包含：权限检查、备份、差异计算等通用功能
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = checkPermission;
exports.createBackup = createBackup;
exports.restoreBackup = restoreBackup;
exports.calculateDiff = calculateDiff;
exports.readFileContent = readFileContent;
exports.writeFileContent = writeFileContent;
const diff = __importStar(require("diff"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// ============================================================================
// 权限检查
// ============================================================================
/**
 * 检查操作权限
 */
async function checkPermission(operation, filePath, ctx) {
    // TODO: 实现权限检查逻辑
    // 例如：检查用户是否有权限修改该资源
    // 示例：删除操作需要特殊权限
    if (operation === 'delete') {
        // 检查用户是否有删除权限
        // const hasPermission = await checkUserPermission(ctx?.userId, 'delete');
        // if (!hasPermission) {
        //   return { allowed: false, reason: 'No permission to delete' };
        // }
    }
    return { allowed: true };
}
// ============================================================================
// 备份功能
// ============================================================================
/**
 * 创建文件备份
 */
async function createBackup(filePath, backupDir = './backups') {
    try {
        // 确保备份目录存在
        await fs.mkdir(backupDir, { recursive: true });
        // 生成备份文件名
        const timestamp = Date.now();
        const fileName = path.basename(filePath);
        const backupFileName = `${fileName}.backup.${timestamp}`;
        const backupPath = path.join(backupDir, backupFileName);
        // 读取原文件
        const content = await fs.readFile(filePath, 'utf-8');
        // 写入备份文件
        await fs.writeFile(backupPath, content, 'utf-8');
        console.log(`[备份] 已创建备份: ${backupPath}`);
        return backupPath;
    }
    catch (error) {
        console.error(`[备份] 创建备份失败: ${error.message}`);
        throw error;
    }
}
/**
 * 恢复备份
 */
async function restoreBackup(filePath, backupPath) {
    try {
        const content = await fs.readFile(backupPath, 'utf-8');
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`[备份] 已恢复备份: ${filePath} <- ${backupPath}`);
    }
    catch (error) {
        console.error(`[备份] 恢复备份失败: ${error.message}`);
        throw error;
    }
}
// ============================================================================
// 差异计算
// ============================================================================
/**
 * 计算文本差异
 */
function calculateDiff(before, after) {
    const changes = diff.diffLines(before, after);
    const added = changes
        .filter(c => c.added)
        .reduce((sum, c) => sum + (c.count || 1), 0);
    const removed = changes
        .filter(c => c.removed)
        .reduce((sum, c) => sum + (c.count || 1), 0);
    const unchanged = changes
        .filter(c => !c.added && !c.removed)
        .reduce((sum, c) => sum + (c.count || 1), 0);
    return {
        changes,
        stats: {
            added,
            removed,
            unchanged,
            totalChanges: added + removed,
        },
    };
}
// ============================================================================
// 文件操作辅助函数
// ============================================================================
/**
 * 读取文件内容
 */
async function readFileContent(filePath) {
    try {
        return await fs.readFile(filePath, 'utf-8');
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            // 文件不存在，返回空字符串
            return '';
        }
        throw error;
    }
}
/**
 * 写入文件内容
 */
async function writeFileContent(filePath, content) {
    // 确保目录存在
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    // 写入文件
    await fs.writeFile(filePath, content, 'utf-8');
}
