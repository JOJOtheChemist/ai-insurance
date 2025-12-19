"use strict";
/**
 * Delete subtasks tool execution logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDeleteSubtasks = executeDeleteSubtasks;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const token_store_1 = require("../../utils/token-store");
/**
 * 提取用户ID和Token
 */
function extractUserInfo(ctx) {
    let userId;
    // 方法1: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[delete_subtasks] 从agent.id提取userId: ${userId}`);
    }
    // 方法2: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[delete_subtasks] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    const token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 执行删除子任务操作
 * 支持单个或批量删除
 */
async function executeDeleteSubtasks(args, ctx) {
    console.log(`[工具] delete_subtasks(items: ${JSON.stringify(args.items)})`);
    try {
        // 🔥 从上下文提取用户信息
        const { userId, token: userToken } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[delete_subtasks] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!userToken) {
            console.error('[delete_subtasks] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[delete_subtasks] ✅ 使用用户 ${userId} 的Token`);
        // 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(userToken);
        if (!numericUserId) {
            console.error('[delete_subtasks] ❌ 无法从Token中解析用户ID');
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 调用后端批量删除API（使用统一配置，添加user_id参数）
        const url = (0, config_1.getApiUrl)(`/api/v1/tasks/batch-delete?user_id=${numericUserId}`);
        console.log(`[delete_subtasks] 🌐 请求后端 API: ${url}`);
        const response = await axios_1.default.post(url, { items: args.items }, {
            headers: (0, config_1.getRequestHeaders)(userToken),
        });
        const result = response.data;
        console.log(`[工具返回] delete_subtasks: 成功删除 ${result.deleted_count} 项，失败 ${result.failed_count} 项`);
        return {
            ok: true,
            data: {
                success: result.success !== false,
                message: result.message || '删除完成',
                deleted_count: result.deleted_count || 0,
                failed_count: result.failed_count || 0,
                results: result.results || [],
            }
        };
    }
    catch (error) {
        console.error(`[工具错误] delete_subtasks: ${error.message}`);
        // 处理HTTP错误响应
        if (error.response) {
            const errorMsg = error.response.data?.detail || error.response.data?.message || error.message;
            return { ok: false, error: `API错误: ${errorMsg}` };
        }
        return { ok: false, error: error.message };
    }
}
