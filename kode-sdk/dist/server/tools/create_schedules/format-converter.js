"use strict";
/**
 * exam.json 格式 ↔ MCP API 格式转换器
 *
 * 用户友好格式 (exam.json) → MCP API 格式
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTime = normalizeTime;
exports.splitTimeSlot = splitTimeSlot;
exports.examToMCP = examToMCP;
exports.mcpToExam = mcpToExam;
exports.mergeAdjacentSlots = mergeAdjacentSlots;
exports.printConversionSummary = printConversionSummary;
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
 * @param time 时间字符串 HH:MM
 * @returns 取整后的时间 (XX:00 或 XX:30)
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
 * @param time 时间字符串，可能不是整半小时
 * @returns 规范化后的时间
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
        // 规范化时间（确保是整半小时）
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
    // 如果没有生成任何时间槽（开始时间等于或晚于结束时间），至少返回开始时间
    if (slots.length === 0) {
        slots.push(normalizedStart);
    }
    return slots;
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
 * 从 MCP 获取任务列表
 */
async function getTasksFromMCP(mcpClient) {
    try {
        const result = await mcpClient.callTool('get_projects', {});
        const projects = result; // MCP Client 已经自动解析 JSON
        const tasks = [];
        for (const category of projects) {
            for (const project of category.projects || []) {
                for (const subtask of project.subtasks || []) {
                    tasks.push({
                        id: subtask.id,
                        name: subtask.name,
                        project_name: project.name,
                        category_name: category.name,
                    });
                }
            }
        }
        return tasks;
    }
    catch (error) {
        console.error('[Format Converter] 获取任务列表失败:', error);
        return [];
    }
}
// ============ 主转换函数 ============
/**
 * exam.json 格式 → MCP API 格式
 */
async function examToMCP(examFormat, options = {}) {
    const { slot_interval = 30, mcpClient, tasks: providedTasks, fuzzyMatch = true, } = options;
    // 获取任务列表
    let tasks = providedTasks || [];
    if (!tasks.length && mcpClient) {
        tasks = await getTasksFromMCP(mcpClient);
    }
    const mcpSchedules = [];
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
            const timeSlots = splitTimeSlot(item.time_slot, slot_interval);
            // 匹配任务
            let plannedTaskId;
            let actualTaskId;
            if (item.planned_task && tasks.length > 0) {
                const matchedTask = fuzzyMatch
                    ? fuzzyMatchTask(item.planned_task, tasks)
                    : tasks.find(t => t.name === item.planned_task);
                if (matchedTask) {
                    plannedTaskId = matchedTask.id;
                }
                else {
                    unmatchedTasks.push({
                        date,
                        time_slot: item.time_slot,
                        task_name: item.planned_task,
                        type: 'planned',
                    });
                }
            }
            if (item.actual_task && tasks.length > 0) {
                const matchedTask = fuzzyMatch
                    ? fuzzyMatchTask(item.actual_task, tasks)
                    : tasks.find(t => t.name === item.actual_task);
                if (matchedTask) {
                    actualTaskId = matchedTask.id;
                }
                else {
                    unmatchedTasks.push({
                        date,
                        time_slot: item.time_slot,
                        task_name: item.actual_task,
                        type: 'actual',
                    });
                }
            }
            // 为每个时间点创建日程
            for (const timeSlot of timeSlots) {
                const mcpItem = {
                    schedule_date: date,
                    time_slot: timeSlot,
                };
                if (plannedTaskId !== undefined) {
                    mcpItem.planned_subtask_id = plannedTaskId;
                }
                if (item.planned_notes) {
                    mcpItem.planned_notes = item.planned_notes;
                }
                if (actualTaskId !== undefined) {
                    mcpItem.actual_subtask_id = actualTaskId;
                }
                if (item.actual_notes) {
                    mcpItem.actual_notes = item.actual_notes;
                }
                if (item.mood) {
                    mcpItem.mood = item.mood;
                }
                mcpSchedules.push(mcpItem);
            }
        }
    }
    // 返回结果
    return {
        ok: true,
        data: { schedules: mcpSchedules },
        unmatchedTasks: unmatchedTasks.length > 0 ? unmatchedTasks : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}
/**
 * MCP API 格式 → exam.json 格式
 * （用于反向转换，可选）
 */
function mcpToExam(mcpFormat, tasks) {
    const examFormat = {};
    for (const item of mcpFormat.schedules) {
        const date = item.schedule_date;
        if (!examFormat[date]) {
            examFormat[date] = [];
        }
        const examItem = {
            time_slot: item.time_slot,
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
        if (item.planned_notes) {
            examItem.planned_notes = item.planned_notes;
        }
        if (item.actual_notes) {
            examItem.actual_notes = item.actual_notes;
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
 * 合并相邻的相同任务时间槽（可选优化）
 */
function mergeAdjacentSlots(examFormat, interval = 30) {
    const merged = {};
    for (const [date, items] of Object.entries(examFormat)) {
        if (!items || items.length === 0)
            continue;
        merged[date] = [];
        let currentGroup = [items[0]];
        for (let i = 1; i < items.length; i++) {
            const prev = items[i - 1];
            const curr = items[i];
            // 检查是否可以合并
            const canMerge = prev.actual_task === curr.actual_task &&
                prev.planned_task === curr.planned_task &&
                prev.actual_notes === curr.actual_notes &&
                prev.planned_notes === curr.planned_notes &&
                prev.mood === curr.mood;
            if (canMerge) {
                currentGroup.push(curr);
            }
            else {
                // 合并当前组
                if (currentGroup.length > 1) {
                    const firstSlot = currentGroup[0].time_slot;
                    const lastSlot = currentGroup[currentGroup.length - 1].time_slot;
                    const lastTime = parseTimeToMinutes(lastSlot) + interval;
                    merged[date].push({
                        ...currentGroup[0],
                        time_slot: `${firstSlot}-${minutesToTimeString(lastTime)}`,
                    });
                }
                else {
                    merged[date].push(currentGroup[0]);
                }
                currentGroup = [curr];
            }
        }
        // 处理最后一组
        if (currentGroup.length > 1) {
            const firstSlot = currentGroup[0].time_slot;
            const lastSlot = currentGroup[currentGroup.length - 1].time_slot;
            const lastTime = parseTimeToMinutes(lastSlot) + interval;
            merged[date].push({
                ...currentGroup[0],
                time_slot: `${firstSlot}-${minutesToTimeString(lastTime)}`,
            });
        }
        else {
            merged[date].push(currentGroup[0]);
        }
    }
    return merged;
}
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
    console.log(`   生成日程数: ${result.data?.schedules.length || 0}`);
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
