"use strict";
/**
 * Get schedule tool execution logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeGetSchedule = executeGetSchedule;
const token_store_1 = require("../../utils/token-store");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
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
        console.log(`[get_schedule_v2] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[get_schedule_v2] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[get_schedule_v2] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 执行获取日程操作
 */
async function executeGetSchedule(args, ctx) {
    console.log(`[工具] 🚀 get_schedule_v2(date: ${args.date})`);
    try {
        // 1. 提取用户信息
        const { userId, token } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[get_schedule_v2] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!token) {
            console.error('[get_schedule_v2] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[get_schedule_v2] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(token);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 调用后端 v2 API 获取合并后的时间表
        const url = (0, config_1.getApiUrl)(`/api/v2/schedule/time-slots/merged?target_date=${args.date}`);
        console.log(`[get_schedule_v2] 🌐 请求后端 API(v2 merged): ${url}`);
        const response = await axios_1.default.get(url, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const mergedData = response.data;
        const apiDate = mergedData.date ? String(mergedData.date) : args.date;
        const items = Array.isArray(mergedData.items) ? mergedData.items : [];
        const notesDict = mergedData.notes || {};
        console.log(`[get_schedule_v2] ✅ 成功获取 ${apiDate} 的合并日程，共 ${items.length} 个时间段段落`);
        // 转换 items 为 V2ScheduleSegment 结构
        const segments = items.map((item) => ({
            date: apiDate,
            time_blocks: item.time_blocks || [],
            time_range: item.time_range,
            mood: item.mood,
            planned_project_id: item.planned_project_id ?? undefined,
            planned_subtask_id: item.planned_subtask_id ?? undefined,
            planned_note_id: item.planned_note_id ?? undefined,
            planned_note_content: item.planned_note_content ?? null,
            planned_note_tags: item.planned_note_tags || [],
            planned_note_attachments: item.planned_note_attachments || {},
            actual_project_id: item.actual_project_id ?? undefined,
            actual_subtask_id: item.actual_subtask_id ?? undefined,
            actual_note_id: item.actual_note_id ?? undefined,
            actual_note_content: item.actual_note_content ?? null,
            actual_note_tags: item.actual_note_tags || [],
            actual_note_attachments: item.actual_note_attachments || {},
        }));
        // 注意：为了节省 token，不再把完整 notes 字典透传给大模型；
        // 仅返回已经合并好的 segments，segment 上保留 *_note_content/tags/attachments 即可满足大模型总结需求。
        return {
            ok: true,
            data: {
                date: apiDate,
                segments,
            },
        };
    }
    catch (error) {
        console.error(`[get_schedule_v2] ❌ 执行失败:`, error.message);
        // 处理HTTP错误响应
        if (error.response) {
            const errorMsg = error.response.data?.detail || error.response.data?.message || error.message;
            return { ok: false, error: `API错误(v2): ${errorMsg}` };
        }
        return { ok: false, error: error.message };
    }
}
