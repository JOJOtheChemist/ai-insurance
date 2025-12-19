"use strict";
/**
 * Batch Edit Tool Template - Executor
 *
 * 批量编辑工具的执行逻辑模板
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeBatchEdit = executeBatchEdit;
const template_core_1 = require("./template-core");
/**
 * 解析文件内容为数据结构（需要根据文件格式实现）
 */
function parseFileContent(content) {
    // TODO: 根据文件格式实现
    // 例如：JSON、YAML、TOML等
    try {
        return JSON.parse(content);
    }
    catch {
        return {};
    }
}
/**
 * 序列化数据结构为文件内容（需要根据文件格式实现）
 */
function serializeFileContent(data) {
    // TODO: 根据文件格式实现
    return JSON.stringify(data, null, 2);
}
/**
 * 执行业务操作（需要根据业务逻辑实现）
 */
function applyOperation(existingData, newData, operation) {
    // TODO: 实现业务操作逻辑
    // 例如：create、update、delete
    const updated = { ...existingData };
    if (!updated.items) {
        updated.items = [];
    }
    switch (operation) {
        case 'create':
            updated.items.push(newData);
            break;
        case 'update':
            const index = updated.items.findIndex((item) => item.id === newData.id);
            if (index !== -1) {
                updated.items[index] = { ...updated.items[index], ...newData };
            }
            break;
        case 'delete':
            updated.items = updated.items.filter((item) => item.id !== newData.id);
            break;
    }
    return updated;
}
/**
 * 验证操作数据（需要根据业务规则实现）
 */
async function validateOperation(data, existingData, operation) {
    // TODO: 实现数据验证逻辑
    if (operation === 'delete') {
        // 删除操作：检查是否存在
        if (!existingData?.items?.some((item) => item.id === data.id)) {
            return {
                valid: false,
                error: `Item ${data.id} not found`,
            };
        }
        return { valid: true };
    }
    if (operation === 'create') {
        // 创建操作：检查是否重复
        if (existingData?.items?.some((item) => item.id === data.id)) {
            return {
                valid: false,
                error: `Item ${data.id} already exists`,
            };
        }
    }
    return { valid: true };
}
/**
 * 执行批量编辑操作
 */
async function executeBatchEdit(input, ctx) {
    const { edits, preview, approvedIndices } = input;
    const results = [];
    const backups = [];
    // ============================================================
    // 预览模式：只计算差异，不执行
    // ============================================================
    if (preview) {
        const operationPreviews = [];
        for (let i = 0; i < edits.length; i++) {
            const edit = edits[i];
            try {
                // 权限检查
                const permission = await (0, template_core_1.checkPermission)(edit.operation, edit.path, ctx);
                if (!permission.allowed) {
                    operationPreviews.push({
                        index: i,
                        path: edit.path,
                        operation: edit.operation,
                        status: 'skipped',
                        message: permission.reason || 'Permission denied',
                    });
                    continue;
                }
                // 读取文件
                const content = await (0, template_core_1.readFileContent)(edit.path);
                const existingData = parseFileContent(content);
                // 验证操作
                const validation = await validateOperation(edit.data, existingData, edit.operation);
                if (!validation.valid) {
                    operationPreviews.push({
                        index: i,
                        path: edit.path,
                        operation: edit.operation,
                        status: 'error',
                        message: validation.error,
                    });
                    continue;
                }
                // 模拟执行操作
                const beforeContent = serializeFileContent(existingData);
                const simulatedData = applyOperation(existingData, edit.data, edit.operation);
                const afterContent = serializeFileContent(simulatedData);
                // 计算差异
                const { changes, stats } = (0, template_core_1.calculateDiff)(beforeContent, afterContent);
                operationPreviews.push({
                    index: i,
                    path: edit.path,
                    operation: edit.operation,
                    status: 'ok',
                    diff: changes,
                    stats,
                });
            }
            catch (error) {
                operationPreviews.push({
                    index: i,
                    path: edit.path,
                    operation: edit.operation,
                    status: 'error',
                    message: error?.message || String(error),
                });
            }
        }
        return {
            ok: operationPreviews.every(r => r.status === 'ok'),
            preview: true,
            results: operationPreviews,
        };
    }
    // ============================================================
    // 执行模式：实际执行操作
    // ============================================================
    // 按文件分组（优化：同一文件的操作合并处理）
    const editsByPath = new Map();
    edits.forEach((edit, index) => {
        // 如果指定了 approvedIndices，只处理批准的操作
        if (approvedIndices && !approvedIndices.includes(index)) {
            results.push({
                index,
                path: edit.path,
                operation: edit.operation,
                status: 'skipped',
                message: 'Operation not approved',
            });
            return;
        }
        if (!editsByPath.has(edit.path)) {
            editsByPath.set(edit.path, []);
        }
        editsByPath.get(edit.path).push({ ...edit, index });
    });
    // 对每个文件执行操作
    for (const [filePath, fileEdits] of editsByPath) {
        let backupPath = null;
        try {
            // 1. 权限检查（对整个文件）
            const firstEdit = fileEdits[0];
            const permission = await (0, template_core_1.checkPermission)(firstEdit.operation, filePath, ctx);
            if (!permission.allowed) {
                fileEdits.forEach(edit => {
                    results.push({
                        index: edit.index,
                        path: edit.path,
                        operation: edit.operation,
                        status: 'skipped',
                        message: permission.reason || 'Permission denied',
                    });
                });
                continue;
            }
            // 2. 创建备份（在执行前）
            try {
                backupPath = await (0, template_core_1.createBackup)(filePath);
                backups.push({ path: filePath, backupPath });
            }
            catch (backupError) {
                console.warn(`[批量编辑] 备份失败，继续执行: ${backupError.message}`);
            }
            // 3. 读取文件
            const content = await (0, template_core_1.readFileContent)(filePath);
            let currentData = parseFileContent(content);
            // 4. 依次执行所有操作（在内存中）
            for (const edit of fileEdits) {
                // 验证操作
                const validation = await validateOperation(edit.data, currentData, edit.operation);
                if (!validation.valid) {
                    results.push({
                        index: edit.index,
                        path: edit.path,
                        operation: edit.operation,
                        status: 'error',
                        message: validation.error,
                    });
                    continue;
                }
                // 执行操作
                currentData = applyOperation(currentData, edit.data, edit.operation);
                results.push({
                    index: edit.index,
                    path: edit.path,
                    operation: edit.operation,
                    status: 'ok',
                });
            }
            // 5. 写入文件（只写一次）
            const updatedContent = serializeFileContent(currentData);
            await (0, template_core_1.writeFileContent)(filePath, updatedContent);
        }
        catch (error) {
            // 错误处理：恢复备份
            if (backupPath) {
                try {
                    await (0, template_core_1.restoreBackup)(filePath, backupPath);
                    console.log(`[批量编辑] 已恢复备份: ${filePath}`);
                }
                catch (restoreError) {
                    console.error(`[批量编辑] 恢复备份失败: ${restoreError.message}`);
                }
            }
            // 记录错误
            fileEdits.forEach(edit => {
                results.push({
                    index: edit.index,
                    path: edit.path,
                    operation: edit.operation,
                    status: 'error',
                    message: error?.message || String(error),
                });
            });
        }
    }
    return {
        ok: results.every(r => r.status === 'ok'),
        results,
        backups: backups.length > 0 ? backups : undefined,
    };
}
