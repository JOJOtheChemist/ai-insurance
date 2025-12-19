"use strict";
/**
 * Delete subtasks tool validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
/**
 * 验证输入参数
 */
function validateInput(args) {
    // 必须提供 items 参数
    if (!args.items) {
        return {
            valid: false,
            error: '必须提供 items 参数（删除项列表）',
        };
    }
    // 验证 items 是数组
    if (!Array.isArray(args.items)) {
        return {
            valid: false,
            error: `items 必须是数组类型，当前类型: ${typeof args.items}`,
        };
    }
    // 验证数组不能为空
    if (args.items.length === 0) {
        return {
            valid: false,
            error: 'items 数组不能为空，至少需要提供一个删除项',
        };
    }
    // 验证每个删除项的格式
    for (let i = 0; i < args.items.length; i++) {
        const item = args.items[i];
        // 验证是对象
        if (typeof item !== 'object' || item === null) {
            return {
                valid: false,
                error: `items[${i}] 必须是对象类型，当前类型: ${typeof item}`,
            };
        }
        // 验证 project_id
        if (!item.project_id) {
            return {
                valid: false,
                error: `items[${i}] 缺少必需的 project_id 字段`,
            };
        }
        if (typeof item.project_id !== 'number') {
            return {
                valid: false,
                error: `items[${i}].project_id 必须是数字类型，当前类型: ${typeof item.project_id}`,
            };
        }
        if (item.project_id <= 0 || !Number.isInteger(item.project_id)) {
            return {
                valid: false,
                error: `items[${i}].project_id 必须是正整数，当前值: ${item.project_id}`,
            };
        }
        // 验证 subtask_id
        if (!item.subtask_id && item.subtask_id !== '') {
            return {
                valid: false,
                error: `items[${i}] 缺少必需的 subtask_id 字段`,
            };
        }
        if (typeof item.subtask_id !== 'string') {
            return {
                valid: false,
                error: `items[${i}].subtask_id 必须是字符串类型，当前类型: ${typeof item.subtask_id}`,
            };
        }
        // 验证 subtask_id 格式：必须是 "all" 或数字字符串
        if (item.subtask_id !== 'all') {
            const subtaskIdNum = parseInt(item.subtask_id, 10);
            if (isNaN(subtaskIdNum) || subtaskIdNum <= 0 || subtaskIdNum.toString() !== item.subtask_id) {
                return {
                    valid: false,
                    error: `items[${i}].subtask_id 必须是 "all" 或正整数字符串，当前值: "${item.subtask_id}"`,
                };
            }
        }
    }
    return { valid: true };
}
