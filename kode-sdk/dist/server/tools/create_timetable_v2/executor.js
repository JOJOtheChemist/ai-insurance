"use strict";
/**
 * Create timetable tool execution logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCreateTimetable = executeCreateTimetable;
const converter_1 = require("./converter");
const validator_1 = require("./validator");
const subtask_validator_1 = require("./subtask-validator");
const token_store_1 = require("../../utils/token-store");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
/**
 * 从主后端 API 获取所有项目列表（包含子任务）
 */
async function getAllProjects(token, userId) {
    try {
        const url = (0, config_1.getApiUrl)(`/api/v1/tasks?user_id=${userId}`);
        const response = await axios_1.default.get(url, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const tasks = response.data.tasks || [];
        const projects = tasks.map((task) => ({
            id: task.id,
            name: task.name,
            subtasks: (task.subtasks || []).map((sub) => ({
                id: sub.id,
                name: sub.name,
                project_id: task.id,
            })),
        }));
        console.log(`[create_timetable] 获取到 ${projects.length} 个项目`);
        return projects;
    }
    catch (error) {
        console.error('[create_timetable] 获取项目列表失败:', error.message);
        return [];
    }
}
/**
 * 提取用户ID和Token
 */
function extractUserInfo(ctx) {
    let userId;
    let token;
    // 方法1: 直接从 ctx 获取（Agent 传递的，优先使用）
    if (ctx?.userId && ctx?.userToken) {
        userId = ctx.userId;
        token = ctx.userToken;
        console.log(`[create_timetable_v2] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[create_timetable_v2] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[create_timetable_v2] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 计算转换统计信息
 */
function calculateStats(apiRequest, validDates) {
    let matchedProjects = 0;
    let matchedSubtasks = 0;
    let unmatchedTasks = 0;
    for (const slot of apiRequest.time_slots) {
        if (slot.planned_project_id)
            matchedProjects++;
        if (slot.actual_project_id)
            matchedProjects++;
        if (slot.planned_subtask_id)
            matchedSubtasks++;
        if (slot.actual_subtask_id)
            matchedSubtasks++;
        // 统计未匹配的任务（只有note没有project_id）
        if (slot.planned_note && !slot.planned_project_id)
            unmatchedTasks++;
        if (slot.actual_note && !slot.actual_project_id)
            unmatchedTasks++;
    }
    return {
        total_time_slots: apiRequest.time_slots.length,
        matched_projects: matchedProjects,
        matched_subtasks: matchedSubtasks,
        unmatched_tasks: unmatchedTasks,
        dates_covered: validDates,
    };
}
/**
 * 执行创建时间表操作
 */
async function executeCreateTimetable(args, ctx) {
    console.log('[工具] 🚀 create_timetable_v2():', JSON.stringify(args, null, 2));
    try {
        // 1. 提取用户信息
        const { userId, token } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[create_timetable_v2] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!token) {
            console.error('[create_timetable_v2] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[create_timetable_v2] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(token);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 获取用户项目列表（用于任务匹配）
        const userProjects = await getAllProjects(token, numericUserId);
        console.log(`[create_timetable_v2] 获取到 ${userProjects.length} 个项目用于匹配`);
        // 4. 验证AI填写的任务名是否存在于用户项目中
        const taskNames = [];
        Object.values(args.schedule).forEach((slots) => {
            slots.forEach((slot) => {
                if (slot.planned_task)
                    taskNames.push(slot.planned_task);
                if (slot.actual_task)
                    taskNames.push(slot.actual_task);
            });
        });
        // 去重
        const uniqueTaskNames = [...new Set(taskNames)];
        const projectNames = userProjects.map(p => p.name);
        const unmatchedTasks = uniqueTaskNames.filter(name => !projectNames.includes(name));
        if (unmatchedTasks.length > 0) {
            console.error(`[create_timetable_v2] ❌ 任务名称验证失败，以下任务不在用户项目列表中: ${unmatchedTasks.join(', ')}`);
            return {
                ok: false,
                error: `任务名称错误！以下任务不存在于用户的项目列表中: ${unmatchedTasks.join('、')}
        
可用的项目列表：
${projectNames.map(name => `- ${name}`).join('\n')}

请使用上述项目名称重新填写时间表。`
            };
        }
        console.log(`[create_timetable_v2] ✅ 任务验证通过: ${uniqueTaskNames.join(', ')}`);
        // 4.5. 验证是否提供了子任务信息
        const missingSubtasks = [];
        Object.entries(args.schedule).forEach(([date, slots]) => {
            slots.forEach((slot, index) => {
                const hasPlannedTask = slot.planned_task;
                const hasActualTask = slot.actual_task;
                const hasPlannedSubtask = slot.planned_subtask;
                const hasActualSubtask = slot.actual_subtask;
                if (hasPlannedTask && !hasPlannedSubtask) {
                    missingSubtasks.push(`${date} 时间段${index + 1}(计划任务: ${slot.planned_task}) 缺少 planned_subtask`);
                }
                if (hasActualTask && !hasActualSubtask) {
                    missingSubtasks.push(`${date} 时间段${index + 1}(实际任务: ${slot.actual_task}) 缺少 actual_subtask`);
                }
            });
        });
        if (missingSubtasks.length > 0) {
            console.error(`[create_timetable_v2] ❌ 子任务验证失败，以下时间段缺少子任务信息:`);
            missingSubtasks.forEach(msg => console.error(`  - ${msg}`));
            // 构建项目和子任务的详细列表
            const projectDetails = userProjects.map(p => {
                const subtaskList = (p.subtasks?.length ?? 0) > 0
                    ? p.subtasks?.map(s => `  · ${s.name}`).join('\n')
                    : '  （无子任务）';
                return `- ${p.name}\n${subtaskList}`;
            }).join('\n\n');
            return {
                ok: false,
                error: `数据不完整！每个任务都必须指定对应的子任务。

缺少子任务的时间段：
${missingSubtasks.map(msg => `- ${msg}`).join('\n')}

可用的项目和子任务列表：
${projectDetails}

请为每个任务指定具体的子任务，重新填写时间表。
注意：planned_task 需要对应 planned_subtask，actual_task 需要对应 actual_subtask`
            };
        }
        console.log(`[create_timetable_v2] ✅ 子任务存在性验证通过`);
        // 4.6. 验证子任务名称是否真的属于对应项目的子任务列表
        const subtaskValidation = (0, subtask_validator_1.validateSubtasks)(args, userProjects);
        if (!subtaskValidation.valid) {
            return {
                ok: false,
                error: subtaskValidation.error,
            };
        }
        // 5. 转换AI格式为API格式
        const validDates = (0, validator_1.extractValidDates)(args.schedule);
        const apiRequest = (0, converter_1.convertAIToAPI)(args.schedule, userProjects);
        console.log(`[create_timetable_v2] 转换完成: ${apiRequest.time_slots.length} 个时间槽指令`);
        // 计算统计信息
        const stats = calculateStats(apiRequest, validDates);
        console.log(`[create_timetable_v2] 统计: 项目匹配=${stats.matched_projects}, 子任务匹配=${stats.matched_subtasks}, 未匹配=${stats.unmatched_tasks}`);
        if (apiRequest.time_slots.length === 0) {
            return {
                ok: false,
                error: '没有生成有效的时间槽，请检查输入数据'
            };
        }
        // 6. 调用后端 API 批量创建时间表
        const url = (0, config_1.getApiUrl)(`/api/v2/schedule/time-slots/batch?user_id=${numericUserId}`);
        console.log(`[create_timetable_v2] 🌐 请求后端 API(v2): ${url}`);
        const response = await axios_1.default.post(url, apiRequest, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const result = response.data;
        console.log(`[create_timetable_v2] ✅ 成功创建/更新时间槽: 新建 ${result.created_count} 个，更新 ${result.updated_count} 个`);
        // 7. 返回成功结果
        return {
            ok: true,
            data: {
                success: true,
                message: `成功创建 ${result.created_count} 个新时间槽，并更新 ${result.updated_count} 个，覆盖 ${stats.dates_covered.length} 个日期`,
                timetable: {
                    created_count: result.created_count,
                    created_ids: result.created_ids || [],
                    dates: stats.dates_covered,
                }
            }
        };
    }
    catch (error) {
        console.error(`[create_timetable_v2] ❌ 执行失败:`, error.message);
        // 处理HTTP错误响应（后端验证失败会返回详细错误信息）
        if (error.response) {
            const errorDetail = error.response.data?.detail || error.response.data?.message || error.message;
            // 如果是验证错误，返回详细错误给AI
            if (error.response.status === 400) {
                return {
                    ok: false,
                    error: `数据验证失败: ${errorDetail}。请检查：1) project_id和subtask_id是否匹配 2) mood值是否有效 3) time_block是否在0-47范围内`
                };
            }
            return { ok: false, error: `API错误 (${error.response.status}): ${errorDetail}` };
        }
        // 其他错误
        return { ok: false, error: `执行失败: ${error.message}` };
    }
}
