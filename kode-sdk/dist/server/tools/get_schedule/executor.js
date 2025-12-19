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
        console.log(`[get_schedule] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[get_schedule] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[get_schedule] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 执行获取日程操作
 */
async function executeGetSchedule(args, ctx) {
    console.log(`[工具] 🚀 get_schedule(date: ${args.date})`);
    try {
        // 1. 提取用户信息
        const { userId, token } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[get_schedule] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!token) {
            console.error('[get_schedule] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[get_schedule] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(token);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 调用后端 API 获取时间表（使用统一配置）
        const url = (0, config_1.getApiUrl)(`/api/v1/schedule/time-slots?target_date=${args.date}&user_id=${numericUserId}`);
        console.log(`[get_schedule] 🌐 请求后端 API: ${url}`);
        const response = await axios_1.default.get(url, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const scheduleData = response.data;
        console.log(`[get_schedule] ✅ 成功获取 ${args.date} 的日程，共 ${scheduleData.time_slots?.length || 0} 个时间槽`);
        // 转换为工具返回格式
        return {
            ok: true,
            data: {
                date: args.date,
                schedules: scheduleData.time_slots || [],
                summary: {
                    total: scheduleData.overview?.total_slots || 0,
                    completed: scheduleData.overview?.completed_slots || 0,
                    planned: scheduleData.overview?.pending_slots || 0,
                }
            }
        };
    }
    catch (error) {
        console.error(`[get_schedule] ❌ 执行失败:`, error.message);
        // 处理HTTP错误响应
        if (error.response) {
            const errorMsg = error.response.data?.detail || error.response.data?.message || error.message;
            return { ok: false, error: `API错误: ${errorMsg}` };
        }
        return { ok: false, error: error.message };
    }
}
