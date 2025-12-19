"use strict";
/**
 * Get schedule tool validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDateFormat = validateDateFormat;
exports.validateDate = validateDate;
exports.validateInput = validateInput;
/**
 * 日期格式验证正则（YYYY-MM-DD）
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
/**
 * 验证日期格式是否正确
 */
function validateDateFormat(date) {
    return DATE_REGEX.test(date);
}
/**
 * 验证日期是否有效（考虑月份天数、闰年等）
 */
function validateDate(date) {
    if (!validateDateFormat(date)) {
        return false;
    }
    const dateObj = new Date(date);
    const [year, month, day] = date.split('-').map(Number);
    return (dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day);
}
/**
 * 验证输入参数
 */
function validateInput(args) {
    // 验证日期字段是否存在
    if (!args.date) {
        return {
            valid: false,
            error: '缺少必需参数: date',
        };
    }
    // 验证日期类型
    if (typeof args.date !== 'string') {
        return {
            valid: false,
            error: `日期必须是字符串类型，当前类型: ${typeof args.date}`,
        };
    }
    // 验证日期格式
    if (!validateDateFormat(args.date)) {
        return {
            valid: false,
            error: `日期格式不正确，期望格式: YYYY-MM-DD，当前值: ${args.date}`,
        };
    }
    // 验证日期有效性
    if (!validateDate(args.date)) {
        return {
            valid: false,
            error: `无效的日期: ${args.date}`,
        };
    }
    return { valid: true };
}
