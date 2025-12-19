"use strict";
/**
 * exam.json 格式 ↔ 主后端 API 格式转换器
 *
 * 用户友好格式 (exam.json) → 主后端 API 格式
 * 替代原来的 MCP 格式转换器
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTime = normalizeTime;
exports.splitTimeSlot = splitTimeSlot;
exports.timeToBlock = timeToBlock;
exports.blockToTime = blockToTime;
exports.examToMainAPI = examToMainAPI;
exports.mainAPIToExam = mainAPIToExam;
exports.printConversionSummary = printConversionSummary;
exports.validateMainAPIFormat = validateMainAPIFormat;
// ============ 工具函数 ============
/**
 * 解析时间字符串为分钟数
 */
function parseTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
/**
 * 分钟数转换为时间字符串
 */
function minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
/**
 * 将时间向下取整到最近的半小时
 */
function roundDownToHalfHour(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    // 向下取整到最近的30分钟
    const roundedMinutes = Math.floor(totalMinutes / 30) * 30;
    return minutesToTimeString(roundedMinutes);
}
/**
 * 规范化时间（确保是整半小时）
 */
function normalizeTime(time) {
    // 检查是否已经是整半小时
    const [hours, minutes] = time.split(':').map(Number);
    if (minutes === 0 || minutes === 30) {
        return time; // 已经是整半小时，直接返回
    }
    // 不是整半小时，向下取整
    return roundDownToHalfHour(time);
}
/**
 * 拆分时间段为多个时间槽
 * @param timeSlot 时间槽，支持 "09:00" 或 "09:00-17:00"
 * @param interval 间隔（分钟）
 * @returns 时间点数组（所有时间都已规范化为整半小时）
 */
function splitTimeSlot(timeSlot, interval = 30) {
    // 单点格式
    if (!timeSlot.includes('-')) {
        const normalized = normalizeTime(timeSlot);
        return [normalized];
    }
    // 时间段格式
    const [start, end] = timeSlot.split('-');
    // 规范化开始和结束时间
    const normalizedStart = normalizeTime(start);
    const normalizedEnd = normalizeTime(end);
    const startMinutes = parseTimeToMinutes(normalizedStart);
    const endMinutes = parseTimeToMinutes(normalizedEnd);
    const slots = [];
    for (let minutes = startMinutes; minutes < endMinutes; minutes += interval) {
        slots.push(minutesToTimeString(minutes));
    }
    // 如果没有生成任何时间槽，至少返回开始时间
    if (slots.length === 0) {
        slots.push(normalizedStart);
    }
    return slots;
}
/**
 * 时间转换为 time_block (0-47)
 * @param time 时间字符串 HH:MM
 * @returns time_block 编号（0-47）
 *
 * @example
 * timeToBlock("00:00") // → 0
 * timeToBlock("00:30") // → 1
 * timeToBlock("09:00") // → 18
 * timeToBlock("09:30") // → 19
 */
function timeToBlock(time) {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 2 + (minute >= 30 ? 1 : 0);
}
/**
 * time_block 转换为时间字符串（反向转换）
 */
function blockToTime(block) {
    const hour = Math.floor(block / 2);
    const minute = (block % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
/**
 * 模糊匹配任务名
 */
function fuzzyMatchTask(taskName, tasks) {
    const lowerName = taskName.toLowerCase().trim();
    // 1. 完全匹配
    const exactMatch = tasks.find(t => t.name.toLowerCase() === lowerName);
    if (exactMatch)
        return exactMatch;
    // 2. 包含匹配
    const containsMatch = tasks.find(t => t.name.toLowerCase().includes(lowerName) ||
        lowerName.includes(t.name.toLowerCase()));
    if (containsMatch)
        return containsMatch;
    // 3. 去除空格后匹配
    const noSpaceName = lowerName.replace(/\s+/g, '');
    const noSpaceMatch = tasks.find(t => t.name.toLowerCase().replace(/\s+/g, '') === noSpaceName);
    if (noSpaceMatch)
        return noSpaceMatch;
    return null;
}
/**
 * 从主后端 API 获取任务列表
 */
async function getTasksFromMainAPI(userToken, baseUrl = 'http://localhost:8000') {
    try {
        console.log('[格式转换器] 从主后端获取项目和子任务列表...');
        const response = await fetch(`${baseUrl}/api/v1/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`获取任务列表失败: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`[格式转换器] ✅ 获取到 ${data.tasks?.length || 0} 个项目`);
        // 构建扁平的子任务列表（包含项目信息）
        const tasks = [];
        for (const project of data.tasks || []) {
            for (const subtask of project.subtasks || []) {
                tasks.push({
                    id: subtask.id,
                    name: subtask.name,
                    project_id: project.id,
                    project_name: project.name,
                });
            }
        }
        console.log(`[格式转换器] ✅ 共 ${tasks.length} 个子任务可用于匹配`);
        return tasks;
    }
    catch (error) {
        console.error('[格式转换器] ❌ 获取任务列表失败:', error);
        return [];
    }
}
// ============ 主转换函数 ============
/**
 * exam.json 格式 → 主后端 API 格式
 *
 * @param examFormat exam.json 格式数据
 * @param options 转换选项
 * @returns 转换结果
 */
async function examToMainAPI(examFormat, options = {}) {
    const { slot_interval = 30, userToken, tasks: providedTasks, fuzzyMatch = true, } = options;
    // 获取任务列表
    let tasks = providedTasks || [];
    if (!tasks.length && userToken) {
        tasks = await getTasksFromMainAPI(userToken);
    }
    const timeSlots = [];
    const unmatchedTasks = [];
    const warnings = [];
    // 遍历每个日期
    for (const [date, scheduleItems] of Object.entries(examFormat)) {
        // 跳过说明字段
        if (date.startsWith('_') || date.startsWith('===')) {
            continue;
        }
        // 验证日期格式
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            warnings.push(`跳过无效日期: ${date}`);
            continue;
        }
        // 处理每个时间槽
        for (const item of scheduleItems) {
            // 拆分时间段
            const timeSlotsArray = splitTimeSlot(item.time_slot, slot_interval);
            // 匹配任务
            let plannedTask = null;
            let actualTask = null;
            if (item.planned_task && tasks.length > 0) {
                plannedTask = fuzzyMatch
                    ? fuzzyMatchTask(item.planned_task, tasks)
                    : tasks.find(t => t.name === item.planned_task) || null;
                if (!plannedTask) {
                    unmatchedTasks.push({
                        date,
                        time_slot: item.time_slot,
                        task_name: item.planned_task,
                        type: 'planned',
                    });
                }
            }
            if (item.actual_task && tasks.length > 0) {
                actualTask = fuzzyMatch
                    ? fuzzyMatchTask(item.actual_task, tasks)
                    : tasks.find(t => t.name === item.actual_task) || null;
                if (!actualTask) {
                    unmatchedTasks.push({
                        date,
                        time_slot: item.time_slot,
                        task_name: item.actual_task,
                        type: 'actual',
                    });
                }
            }
            // 为每个时间点创建时间槽
            for (const timeSlotStr of timeSlotsArray) {
                const timeBlock = timeToBlock(timeSlotStr);
                const apiTimeSlot = {
                    date: date,
                    time_block: timeBlock,
                    mood: item.mood || null,
                    planned_project_id: plannedTask?.project_id || null,
                    planned_subtask_id: plannedTask?.id || null,
                    planned_note: item.planned_notes || null, // ⚠️ 注意：单数
                    actual_project_id: actualTask?.project_id || null,
                    actual_subtask_id: actualTask?.id || null,
                    actual_note: item.actual_notes || null, // ⚠️ 注意：单数
                };
                timeSlots.push(apiTimeSlot);
            }
        }
    }
    // 返回结果
    return {
        ok: true,
        data: { time_slots: timeSlots },
        unmatchedTasks: unmatchedTasks.length > 0 ? unmatchedTasks : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}
/**
 * 主后端 API 格式 → exam.json 格式
 * （用于反向转换，可选）
 */
function mainAPIToExam(mainAPIFormat, tasks) {
    const examFormat = {};
    for (const item of mainAPIFormat.time_slots) {
        const date = item.date;
        if (!examFormat[date]) {
            examFormat[date] = [];
        }
        const timeStr = blockToTime(item.time_block);
        const examItem = {
            time_slot: timeStr,
        };
        // 将任务 ID 转换回任务名（如果提供了任务列表）
        if (item.planned_subtask_id && tasks) {
            const task = tasks.find(t => t.id === item.planned_subtask_id);
            if (task) {
                examItem.planned_task = task.name;
            }
        }
        if (item.actual_subtask_id && tasks) {
            const task = tasks.find(t => t.id === item.actual_subtask_id);
            if (task) {
                examItem.actual_task = task.name;
            }
        }
        if (item.planned_note) {
            examItem.planned_notes = item.planned_note;
        }
        if (item.actual_note) {
            examItem.actual_notes = item.actual_note;
        }
        if (item.mood) {
            examItem.mood = item.mood;
        }
        examFormat[date].push(examItem);
    }
    return examFormat;
}
// ============ 辅助函数 ============
/**
 * 打印转换结果摘要
 */
function printConversionSummary(result) {
    console.log('\n========== 转换结果摘要 ==========');
    if (!result.ok) {
        console.log(`❌ 转换失败: ${result.error}`);
        return;
    }
    console.log(`✅ 转换成功`);
    console.log(`   生成时间槽数: ${result.data?.time_slots.length || 0}`);
    if (result.unmatchedTasks && result.unmatchedTasks.length > 0) {
        console.log(`\n⚠️  未匹配任务 (${result.unmatchedTasks.length}):`);
        for (const task of result.unmatchedTasks) {
            console.log(`   - ${task.date} ${task.time_slot}: ${task.task_name} (${task.type})`);
        }
    }
    if (result.warnings && result.warnings.length > 0) {
        console.log(`\n⚠️  警告信息:`);
        for (const warning of result.warnings) {
            console.log(`   - ${warning}`);
        }
    }
    console.log('=================================\n');
}
/**
 * 验证转换后的数据
 */
function validateMainAPIFormat(data) {
    const errors = [];
    if (!data.time_slots || !Array.isArray(data.time_slots)) {
        errors.push('time_slots 必须是数组');
        return { valid: false, errors };
    }
    for (let i = 0; i < data.time_slots.length; i++) {
        const slot = data.time_slots[i];
        // 验证日期格式
        if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date)) {
            errors.push(`时间槽 #${i + 1}: 无效的日期格式 "${slot.date}"`);
        }
        // 验证 time_block 范围
        if (slot.time_block < 0 || slot.time_block > 47) {
            errors.push(`时间槽 #${i + 1}: time_block 必须在 0-47 之间，当前为 ${slot.time_block}`);
        }
        // 验证至少有一个任务或心情
        const hasPlanned = slot.planned_project_id !== null || slot.planned_subtask_id !== null;
        const hasActual = slot.actual_project_id !== null || slot.actual_subtask_id !== null;
        const hasMood = slot.mood !== null;
        if (!hasPlanned && !hasActual && !hasMood) {
            errors.push(`时间槽 #${i + 1}: 至少需要有计划任务、实际任务或心情之一`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
