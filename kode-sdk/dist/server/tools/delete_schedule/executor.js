"use strict";
/**
 * Delete schedule tool execution logic
 * 批量删除时间段工具执行逻辑
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDeleteSchedule = executeDeleteSchedule;
const axios_1 = __importDefault(require("axios"));
const token_store_1 = require("../../utils/token-store");
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
        console.log(`[delete_schedule] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[delete_schedule] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[delete_schedule] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 执行批量删除时间段操作
 * 直接调用后端批量删除API
 */
async function executeDeleteSchedule(args, ctx) {
    console.log(`[工具] delete_schedule - 批量删除时间段`);
    console.log(`[工具] 要删除的ID列表: [${args.slot_ids.join(', ')}]`);
    console.log(`[工具] 删除数量: ${args.slot_ids.length}`);
    try {
        // 🔥 从上下文提取用户信息
        const { userId, token: userToken } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[delete_schedule] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!userToken) {
            console.error('[delete_schedule] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[delete_schedule] ✅ 使用用户 ${userId} 的Token`);
        // 🔥 从Token解析userId（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(userToken);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 🔄 格式转换说明：
        // - Agent调用格式: delete_schedule({ slot_ids: [123, 456] })  ← AI传入对象格式
        // - 工具接收格式: args = { slot_ids: [123, 456] }
        // - 后端期望格式: [123, 456]  ← 纯数组，不是对象！
        // - 转换方式: 直接发送 args.slot_ids（提取数组）
        const url = (0, config_1.getApiUrl)(`/api/v1/schedule/time-slots/batch-delete?user_id=${numericUserId}`);
        console.log(`[工具] 🌐 请求URL: ${url}`);
        console.log(`[工具] 📥 AI传入参数（对象）: { slot_ids: [${args.slot_ids.join(', ')}] }`);
        console.log(`[工具] 📤 发送给后端（数组）: [${args.slot_ids.join(', ')}]`);
        // ✅ 关键转换：发送 args.slot_ids（数组），不是 {slot_ids: args.slot_ids}（对象）
        const response = await axios_1.default.post(url, args.slot_ids, {
            headers: {
                'Authorization': (0, config_1.getAuthHeader)(userToken),
                'Content-Type': 'application/json',
            },
        });
        const result = response.data;
        console.log('[工具返回] delete_schedule: 批量删除成功');
        const deletedCount = result.data?.deleted_count || result.deleted_count || 0;
        const deletedIds = result.data?.deleted_ids || result.deleted_ids || [];
        console.log(`[工具返回] 删除数量: ${deletedCount}/${args.slot_ids.length}`);
        return {
            ok: true,
            data: {
                deleted_count: deletedCount,
                requested_count: args.slot_ids.length,
                deleted_ids: deletedIds,
                message: result.message || `成功删除 ${deletedCount} 个时间段`,
            }
        };
    }
    catch (error) {
        console.error(`[工具错误] delete_schedule: ${error.message}`);
        // 处理HTTP错误响应
        if (error.response) {
            const errorMsg = error.response.data?.detail || error.response.data?.message || error.message;
            return { ok: false, error: `API错误: ${errorMsg}` };
        }
        return {
            ok: false,
            error: error.message || '批量删除时间段失败'
        };
    }
}
