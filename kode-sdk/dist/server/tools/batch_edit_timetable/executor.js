"use strict";
/**
 * Batch Edit Timetable Tool - Executor
 *
 * 批量编辑时间表工具的执行逻辑
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeBatchEditTimetable = executeBatchEditTimetable;
const template_core_1 = require("../batch_edit_template/template-core");
const token_store_1 = require("../../utils/token-store");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
/**
 * 提取用户ID和Token
 */
function extractUserInfo(ctx) {
    let userId;
    let token;
    // 方法1: 直接从 ctx 获取
    if (ctx?.userId && ctx?.userToken) {
        userId = ctx.userId;
        token = ctx.userToken;
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
    }
    // 方法3: 从 session 映射查找
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 检查操作权限
 */
async function checkPermission(operation, ctx) {
    const { userId, token } = extractUserInfo(ctx);
    if (!userId || !token) {
        return { allowed: false, reason: 'User not authenticated' };
    }
    // TODO: 实现更详细的权限检查
    // 例如：检查用户是否有权限执行该操作
    // 删除操作可能需要特殊权限
    if (operation === 'delete') {
        // 可以添加额外的权限检查
    }
    return { allowed: true };
}
/**
 * 从API获取时间槽数据（用于预览和备份）
 */
async function getTimeSlot(timeSlotId, token, userId) {
    try {
        const url = (0, config_1.getApiUrl)(`/api/v1/schedules?user_id=${userId}&time_slot_id=${timeSlotId}`);
        const response = await axios_1.default.get(url, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const schedules = response.data.schedules || [];
        const slot = schedules.find((s) => s.id === timeSlotId);
        if (!slot) {
            return null;
        }
        return {
            id: slot.id,
            date: slot.date,
            time_block: slot.time_block,
            planned_project_id: slot.planned_project_id,
            planned_subtask_id: slot.planned_subtask_id,
            planned_note: slot.planned_note,
            actual_project_id: slot.actual_project_id,
            actual_subtask_id: slot.actual_subtask_id,
            actual_note: slot.actual_note,
            mood: slot.mood,
        };
    }
    catch (error) {
        console.error(`[batch_edit_timetable] 获取时间槽失败: ${error.message}`);
        return null;
    }
}
/**
 * 调用批量操作API
 */
async function callBatchAPI(operation, data, token, userId) {
    try {
        let url;
        let method;
        let requestData;
        switch (operation) {
            case 'create':
                url = (0, config_1.getApiUrl)(`/api/v1/schedules`);
                method = 'post';
                requestData = {
                    user_id: userId,
                    date: data.date,
                    time_block: data.time_block,
                    planned_project_id: data.planned_project_id,
                    planned_subtask_id: data.planned_subtask_id,
                    planned_note: data.planned_note,
                    actual_project_id: data.actual_project_id,
                    actual_subtask_id: data.actual_subtask_id,
                    actual_note: data.actual_note,
                    mood: data.mood,
                };
                break;
            case 'update':
                if (!data.id) {
                    return { success: false, error: 'Time slot ID is required for update' };
                }
                url = (0, config_1.getApiUrl)(`/api/v1/schedules/${data.id}`);
                method = 'put';
                requestData = {
                    planned_project_id: data.planned_project_id,
                    planned_subtask_id: data.planned_subtask_id,
                    planned_note: data.planned_note,
                    actual_project_id: data.actual_project_id,
                    actual_subtask_id: data.actual_subtask_id,
                    actual_note: data.actual_note,
                    mood: data.mood,
                };
                break;
            case 'delete':
                if (!data.id) {
                    return { success: false, error: 'Time slot ID is required for delete' };
                }
                url = (0, config_1.getApiUrl)(`/api/v1/schedules/${data.id}`);
                method = 'delete';
                requestData = undefined;
                break;
        }
        const response = await (0, axios_1.default)({
            method,
            url,
            data: requestData,
            headers: (0, config_1.getRequestHeaders)(token),
        });
        if (operation === 'create') {
            const timeSlotId = response.data.id || response.data.time_slot_id;
            return { success: true, timeSlotId };
        }
        return { success: true, timeSlotId: data.id };
    }
    catch (error) {
        console.error(`[batch_edit_timetable] API调用失败: ${error.message}`);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
}
/**
 * 执行批量编辑时间表操作
 */
async function executeBatchEditTimetable(input, ctx) {
    const { edits, preview, approvedIndices } = input;
    const results = [];
    const backups = [];
    const { userId, token } = extractUserInfo(ctx);
    if (!userId || !token) {
        return {
            ok: false,
            results: edits.map((_, index) => ({
                index,
                operation: edits[index].operation,
                status: 'error',
                message: 'User not authenticated',
            })),
        };
    }
    const userIdNum = (0, config_1.parseUserIdFromToken)(token);
    if (!userIdNum) {
        return {
            ok: false,
            results: edits.map((_, index) => ({
                index,
                operation: edits[index].operation,
                status: 'error',
                message: 'Invalid user token',
            })),
        };
    }
    // ============================================================
    // 预览模式：只计算差异，不执行
    // ============================================================
    if (preview) {
        const operationPreviews = [];
        for (let i = 0; i < edits.length; i++) {
            const edit = edits[i];
            try {
                // 权限检查
                const permission = await checkPermission(edit.operation, ctx);
                if (!permission.allowed) {
                    operationPreviews.push({
                        index: i,
                        operation: edit.operation,
                        status: 'skipped',
                        message: permission.reason || 'Permission denied',
                    });
                    continue;
                }
                // 获取现有数据（用于计算差异）
                let existingData = null;
                if (edit.operation === 'update' || edit.operation === 'delete') {
                    if (edit.data.id) {
                        existingData = await getTimeSlot(edit.data.id, token, userIdNum);
                        if (!existingData) {
                            operationPreviews.push({
                                index: i,
                                operation: edit.operation,
                                status: 'error',
                                message: `Time slot ${edit.data.id} not found`,
                            });
                            continue;
                        }
                    }
                }
                // 计算差异
                if (existingData) {
                    const beforeContent = JSON.stringify(existingData, null, 2);
                    const afterContent = edit.operation === 'delete'
                        ? '' // 删除操作后为空
                        : JSON.stringify({ ...existingData, ...edit.data }, null, 2);
                    const { changes, stats } = (0, template_core_1.calculateDiff)(beforeContent, afterContent);
                    operationPreviews.push({
                        index: i,
                        operation: edit.operation,
                        status: 'ok',
                        diff: changes,
                        stats,
                    });
                }
                else {
                    // 创建操作：显示新增内容
                    const newContent = JSON.stringify(edit.data, null, 2);
                    const { changes, stats } = (0, template_core_1.calculateDiff)('', newContent);
                    operationPreviews.push({
                        index: i,
                        operation: edit.operation,
                        status: 'ok',
                        diff: changes,
                        stats,
                    });
                }
            }
            catch (error) {
                operationPreviews.push({
                    index: i,
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
    for (let i = 0; i < edits.length; i++) {
        const edit = edits[i];
        // 如果指定了 approvedIndices，只处理批准的操作
        if (approvedIndices && !approvedIndices.includes(i)) {
            results.push({
                index: i,
                operation: edit.operation,
                status: 'skipped',
                message: 'Operation not approved',
            });
            continue;
        }
        try {
            // 1. 权限检查
            const permission = await checkPermission(edit.operation, ctx);
            if (!permission.allowed) {
                results.push({
                    index: i,
                    operation: edit.operation,
                    status: 'skipped',
                    message: permission.reason || 'Permission denied',
                });
                continue;
            }
            // 2. 创建备份（对于 update/delete 操作）
            if ((edit.operation === 'update' || edit.operation === 'delete') && edit.data.id) {
                const existingData = await getTimeSlot(edit.data.id, token, userIdNum);
                if (existingData) {
                    backups.push({
                        operationIndex: i,
                        timeSlotId: edit.data.id,
                        backupData: existingData,
                    });
                }
            }
            // 3. 调用批量操作API
            const apiResult = await callBatchAPI(edit.operation, edit.data, token, userIdNum);
            if (apiResult.success) {
                results.push({
                    index: i,
                    operation: edit.operation,
                    status: 'ok',
                    timeSlotId: apiResult.timeSlotId || edit.data.id,
                });
            }
            else {
                results.push({
                    index: i,
                    operation: edit.operation,
                    status: 'error',
                    message: apiResult.error,
                });
            }
        }
        catch (error) {
            // 错误处理：可以尝试恢复备份（如果需要）
            results.push({
                index: i,
                operation: edit.operation,
                status: 'error',
                message: error?.message || String(error),
            });
        }
    }
    return {
        ok: results.every(r => r.status === 'ok'),
        results,
        backups: backups.length > 0 ? backups : undefined,
    };
}
