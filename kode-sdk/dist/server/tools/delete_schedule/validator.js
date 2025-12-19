"use strict";
/**
 * Delete schedule tool validation logic
 * 批量删除时间段工具验证逻辑
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
/**
 * 验证输入参数
 * 验证时间段ID列表的有效性
 */
function validateInput(args) {
    // 必须提供 slot_ids
    if (!args.slot_ids) {
        return {
            valid: false,
            error: '必须提供 slot_ids 参数（要删除的时间段ID列表）',
        };
    }
    // 验证是否为数组
    if (!Array.isArray(args.slot_ids)) {
        return {
            valid: false,
            error: `slot_ids 必须是数组类型，当前类型: ${typeof args.slot_ids}`,
        };
    }
    // 验证数组不能为空
    if (args.slot_ids.length === 0) {
        return {
            valid: false,
            error: 'slot_ids 数组不能为空，至少需要提供一个要删除的时间段ID',
        };
    }
    // 验证数组中的每个元素都是有效的正整数
    for (let i = 0; i < args.slot_ids.length; i++) {
        const id = args.slot_ids[i];
        if (typeof id !== 'number') {
            return {
                valid: false,
                error: `slot_ids[${i}] 必须是数字类型，当前类型: ${typeof id}`,
            };
        }
        if (id <= 0 || !Number.isInteger(id)) {
            return {
                valid: false,
                error: `slot_ids[${i}] 必须是正整数，当前值: ${id}`,
            };
        }
    }
    return { valid: true };
}
