"use strict";
/**
 * Delete timetable input validator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValidDates = extractValidDates;
exports.validateInput = validateInput;
/**
 * 验证日期格式是否正确
 */
function isValidDate(dateStr) {
    // 检查格式 YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return false;
    }
    // 检查是否是有效日期
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}
/**
 * 验证时间格式是否正确
 */
function isValidTime(timeStr) {
    // 支持 "09:00" 或 "9:00" 格式
    const timePattern = /^\d{1,2}:\d{2}$/;
    if (!timePattern.test(timeStr)) {
        return false;
    }
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}
/**
 * 验证时间段格式是否正确
 */
function isValidTimeSlot(timeSlot) {
    if (timeSlot.includes('-')) {
        // 时间段格式 "09:00-17:00"
        const [start, end] = timeSlot.split('-').map(t => t.trim());
        return isValidTime(start) && isValidTime(end);
    }
    else {
        // 单点格式 "09:00"
        return isValidTime(timeSlot.trim());
    }
}
/**
 * 提取并验证所有有效日期
 */
function extractValidDates(schedule) {
    const validDates = [];
    for (const dateStr of Object.keys(schedule)) {
        // 跳过说明字段
        if (dateStr.startsWith('_') || dateStr.startsWith('===')) {
            continue;
        }
        if (isValidDate(dateStr)) {
            validDates.push(dateStr);
        }
    }
    return validDates;
}
/**
 * 验证输入参数
 */
function validateInput(args) {
    // 1. 检查是否提供了schedule参数
    if (!args.schedule) {
        return {
            valid: false,
            error: '缺少必需参数: schedule'
        };
    }
    // 2. 检查schedule是否是对象
    if (typeof args.schedule !== 'object' || Array.isArray(args.schedule)) {
        return {
            valid: false,
            error: 'schedule必须是对象格式（日期作为key）'
        };
    }
    // 3. 提取有效日期
    const validDates = extractValidDates(args.schedule);
    if (validDates.length === 0) {
        return {
            valid: false,
            error: '没有找到有效的日期（格式应为 YYYY-MM-DD）'
        };
    }
    // 4. 验证每个日期的时间槽
    for (const dateStr of validDates) {
        const slots = args.schedule[dateStr];
        // 检查是否是数组
        if (!Array.isArray(slots)) {
            return {
                valid: false,
                error: `日期 ${dateStr} 的值必须是数组`
            };
        }
        // 检查是否为空
        if (slots.length === 0) {
            return {
                valid: false,
                error: `日期 ${dateStr} 的时间槽数组不能为空`
            };
        }
        // 验证每个时间槽
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            // 检查是否有time_slot字段
            if (!slot.time_slot) {
                return {
                    valid: false,
                    error: `日期 ${dateStr} 的第 ${i + 1} 个时间槽缺少 time_slot 字段`
                };
            }
            // 验证time_slot格式
            if (!isValidTimeSlot(slot.time_slot)) {
                return {
                    valid: false,
                    error: `日期 ${dateStr} 的时间槽 "${slot.time_slot}" 格式无效。正确格式: "09:00" 或 "09:00-17:00"`
                };
            }
        }
    }
    // 5. 所有验证通过
    return { valid: true };
}
