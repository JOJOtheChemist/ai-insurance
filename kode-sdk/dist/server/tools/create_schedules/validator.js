"use strict";
/**
 * 数据验证层
 *
 * 负责：
 * - 使用 Zod 定义 GLM 输出的数据结构
 * - 验证任务名是否在可用列表中
 * - 生成详细的错误信息供大模型重试
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleDataSchema = exports.TimeSlotSchema = void 0;
exports.validateScheduleData = validateScheduleData;
exports.quickValidateTaskNames = quickValidateTaskNames;
const zod_1 = require("zod");
/**
 * 单个时间槽的 Schema
 */
exports.TimeSlotSchema = zod_1.z.object({
    time_slot: zod_1.z.string()
        .describe('时间槽，格式为 "HH:MM" 或 "HH:MM-HH:MM"'),
    planned_task: zod_1.z.string().optional()
        .describe('计划任务名，必须从任务列表中精确匹配'),
    planned_notes: zod_1.z.string().optional()
        .describe('计划备注'),
    actual_task: zod_1.z.string().optional()
        .describe('实际任务名，必须从任务列表中精确匹配'),
    actual_notes: zod_1.z.string().optional()
        .describe('实际备注'),
    mood: zod_1.z.string().optional()
        .describe('心情'),
});
/**
 * 完整的日程数据 Schema
 * 格式：{ "YYYY-MM-DD": [TimeSlot, TimeSlot, ...] }
 */
exports.ScheduleDataSchema = zod_1.z.record(zod_1.z.string(), // 日期 key
zod_1.z.array(exports.TimeSlotSchema) // 时间槽数组
);
/**
 * 验证 GLM 输出的数据
 *
 * @param rawData - GLM 输出的原始数据
 * @param availableTaskNames - 可用的任务名列表
 * @returns 验证结果
 */
function validateScheduleData(rawData, availableTaskNames) {
    // Step 1: 验证数据结构（Zod Schema 验证）
    const parseResult = exports.ScheduleDataSchema.safeParse(rawData);
    if (!parseResult.success) {
        const zodError = parseResult.error.format();
        return {
            valid: false,
            errorMessage: `❌ JSON 格式错误：\n${JSON.stringify(zodError, null, 2)}\n\n请检查 JSON 格式是否符合要求。`,
        };
    }
    const data = parseResult.data;
    // Step 2: 验证任务名（精确匹配）
    const errors = [];
    for (const [date, schedules] of Object.entries(data)) {
        // 跳过元数据字段
        if (date.startsWith('_') || date.startsWith('===')) {
            continue;
        }
        for (const schedule of schedules) {
            const timeSlot = schedule.time_slot || '';
            // 验证 planned_task
            if (schedule.planned_task) {
                if (!availableTaskNames.includes(schedule.planned_task)) {
                    errors.push({
                        date,
                        time_slot: timeSlot,
                        task: schedule.planned_task,
                        field: 'planned_task',
                        reason: '任务名不在系统列表中',
                    });
                }
            }
            // 验证 actual_task
            if (schedule.actual_task) {
                if (!availableTaskNames.includes(schedule.actual_task)) {
                    errors.push({
                        date,
                        time_slot: timeSlot,
                        task: schedule.actual_task,
                        field: 'actual_task',
                        reason: '任务名不在系统列表中',
                    });
                }
            }
        }
    }
    // Step 3: 返回验证结果
    if (errors.length > 0) {
        const errorMessage = buildErrorMessage(errors, availableTaskNames);
        return {
            valid: false,
            errors,
            errorMessage,
        };
    }
    return {
        valid: true,
        data,
    };
}
/**
 * 构建详细的错误信息
 */
function buildErrorMessage(errors, availableTaskNames) {
    let message = '❌ 任务名验证失败！\n\n';
    message += '**发现以下错误：**\n';
    for (const error of errors) {
        message += `- 📅 ${error.date} ${error.time_slot}\n`;
        message += `  ❌ "${error.task}" (${error.field})\n`;
        message += `  💡 原因：${error.reason}\n\n`;
    }
    message += '**可用的任务名（前20个）：**\n';
    const taskList = availableTaskNames.slice(0, 20).join(', ');
    message += taskList + '\n\n';
    message += '**解决方案：**\n';
    message += '1. 从上面的任务列表中【精确复制】任务名\n';
    message += '2. 任务名必须一个字都不能错\n';
    message += '3. 如果找不到完全匹配的，选择最相关的任务\n\n';
    message += '请重新生成完整的 JSON！';
    return message;
}
/**
 * 快速验证（只检查任务名，不使用 Zod）
 * 用于需要快速验证的场景
 */
function quickValidateTaskNames(data, availableTaskNames) {
    const errors = [];
    for (const [date, schedules] of Object.entries(data)) {
        if (date.startsWith('_') || date.startsWith('==='))
            continue;
        for (const schedule of schedules) {
            const timeSlot = schedule.time_slot || '';
            if (schedule.planned_task && !availableTaskNames.includes(schedule.planned_task)) {
                errors.push({
                    date,
                    time_slot: timeSlot,
                    task: schedule.planned_task,
                    field: 'planned_task',
                    reason: '任务名不在系统列表中',
                });
            }
            if (schedule.actual_task && !availableTaskNames.includes(schedule.actual_task)) {
                errors.push({
                    date,
                    time_slot: timeSlot,
                    task: schedule.actual_task,
                    field: 'actual_task',
                    reason: '任务名不在系统列表中',
                });
            }
        }
    }
    return { valid: errors.length === 0, errors };
}
