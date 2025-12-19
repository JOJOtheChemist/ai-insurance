"use strict";
/**
 * Create timetable tool validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
exports.extractValidDates = extractValidDates;
/**
 * 验证日期格式 YYYY-MM-DD
 */
function isValidDateFormat(dateStr) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}
/**
 * 验证时间格式 HH:MM 或 HH:MM-HH:MM
 */
function isValidTimeFormat(timeStr) {
    // 单点格式: "09:00"
    const singleTimeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    // 时间段格式: "09:00-17:00"
    const rangeTimeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return singleTimeRegex.test(timeStr) || rangeTimeRegex.test(timeStr);
}
/**
 * 验证时间是否是整半小时（只能是 XX:00 或 XX:30）
 */
function isHalfHourTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return minutes === 0 || minutes === 30;
}
/**
 * 验证时间槽中的时间格式是否符合要求（必须是整半小时）
 */
function validateHalfHourTimeFormat(timeSlot) {
    if (timeSlot.includes('-')) {
        // 时间段格式 "09:00-17:00"
        const [start, end] = timeSlot.split('-').map(t => t.trim());
        // 验证开始时间
        if (!isHalfHourTime(start)) {
            return {
                valid: false,
                error: `时间槽 "${timeSlot}" 中的开始时间 "${start}" 必须是整半小时（XX:00 或 XX:30），不能是 "${start}"`
            };
        }
        // 验证结束时间
        if (!isHalfHourTime(end)) {
            return {
                valid: false,
                error: `时间槽 "${timeSlot}" 中的结束时间 "${end}" 必须是整半小时（XX:00 或 XX:30），不能是 "${end}"`
            };
        }
    }
    else {
        // 单点格式 "09:00"
        if (!isHalfHourTime(timeSlot)) {
            return {
                valid: false,
                error: `时间槽 "${timeSlot}" 必须是整半小时（XX:00 或 XX:30），不能是 "${timeSlot}"`
            };
        }
    }
    return { valid: true };
}
/**
 * 验证mood值（可以是中文或英文）
 */
function isValidMood(mood) {
    const validEnglishMoods = [
        'happy', 'sad', 'angry', 'anxious', 'calm',
        'tired', 'excited', 'focused', 'stressed', 'neutral', 'relaxed'
    ];
    const validChineseMoods = [
        '愉快', '开心', '高兴',
        '悲伤', '难过',
        '生气', '愤怒',
        '焦虑', '紧张',
        '平静', '冷静',
        '疲惫', '累',
        '兴奋',
        '专注', '集中',
        '压力', '有压力',
        '中性', '一般',
        '放松', '轻松'
    ];
    const moodLower = mood.toLowerCase().trim();
    return validEnglishMoods.includes(moodLower) || validChineseMoods.includes(mood.trim());
}
/**
 * 验证时间槽对象
 */
function validateTimeSlot(slot, dateStr, slotIndex) {
    // 验证time_slot字段（必填）
    if (!slot.time_slot) {
        return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: time_slot 是必填项` };
    }
    if (typeof slot.time_slot !== 'string') {
        return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: time_slot 必须是字符串` };
    }
    if (!isValidTimeFormat(slot.time_slot)) {
        return {
            valid: false,
            error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: time_slot "${slot.time_slot}" 格式无效，应为 "HH:MM" 或 "HH:MM-HH:MM"`
        };
    }
    // 验证时间必须是整半小时
    const halfHourValidation = validateHalfHourTimeFormat(slot.time_slot);
    if (!halfHourValidation.valid) {
        return {
            valid: false,
            error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: ${halfHourValidation.error}。例如：4:20 应改为 4:00 或 4:30，6:15 应改为 6:00。`
        };
    }
    // 验证可选字段类型
    if (slot.planned_task !== undefined && typeof slot.planned_task !== 'string') {
        return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: planned_task 必须是字符串` };
    }
    if (slot.planned_notes !== undefined && typeof slot.planned_notes !== 'string') {
        return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: planned_notes 必须是字符串` };
    }
    if (slot.actual_task !== undefined && typeof slot.actual_task !== 'string') {
        return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: actual_task 必须是字符串` };
    }
    if (slot.actual_notes !== undefined && typeof slot.actual_notes !== 'string') {
        return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: actual_notes 必须是字符串` };
    }
    // 验证mood值
    if (slot.mood !== undefined) {
        if (typeof slot.mood !== 'string') {
            return { valid: false, error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: mood 必须是字符串` };
        }
        if (!isValidMood(slot.mood)) {
            return {
                valid: false,
                error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: mood "${slot.mood}" 无效，请使用有效的心情值`
            };
        }
    }
    // 至少要有一个任务或心情
    if (!slot.planned_task && !slot.actual_task && !slot.mood) {
        return {
            valid: false,
            error: `日期 ${dateStr} 的时间槽 #${slotIndex + 1}: 至少需要 planned_task, actual_task 或 mood 其中之一`
        };
    }
    return { valid: true };
}
/**
 * 验证schedule对象
 */
function validateSchedule(schedule) {
    if (!schedule || typeof schedule !== 'object') {
        return { valid: false, error: 'schedule 必须是对象' };
    }
    const dates = Object.keys(schedule).filter(key => !key.startsWith('_') && !key.startsWith('==='));
    if (dates.length === 0) {
        return { valid: false, error: 'schedule 必须至少包含一个日期' };
    }
    // 验证每个日期
    for (const dateStr of dates) {
        // 验证日期格式
        if (!isValidDateFormat(dateStr)) {
            return { valid: false, error: `日期 "${dateStr}" 格式无效，应为 YYYY-MM-DD` };
        }
        const slots = schedule[dateStr];
        // 验证时间槽数组
        if (!Array.isArray(slots)) {
            return { valid: false, error: `日期 ${dateStr} 的值必须是数组` };
        }
        if (slots.length === 0) {
            return { valid: false, error: `日期 ${dateStr} 至少需要一个时间槽` };
        }
        // 验证每个时间槽
        for (let i = 0; i < slots.length; i++) {
            const validation = validateTimeSlot(slots[i], dateStr, i);
            if (!validation.valid) {
                return validation;
            }
        }
    }
    return { valid: true };
}
/**
 * 验证输入参数
 */
function validateInput(args) {
    // 验证 schedule（必填）
    if (!args.schedule) {
        return { valid: false, error: 'schedule 是必填项' };
    }
    // 验证 schedule 内容
    return validateSchedule(args.schedule);
}
/**
 * 验证并提取有效日期
 */
function extractValidDates(schedule) {
    return Object.keys(schedule)
        .filter(key => !key.startsWith('_') && !key.startsWith('==='))
        .filter(dateStr => isValidDateFormat(dateStr));
}
