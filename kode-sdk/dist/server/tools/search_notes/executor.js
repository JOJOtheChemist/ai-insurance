"use strict";
/**
 * 搜索备注工具执行器
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSearchNotes = executeSearchNotes;
const token_store_1 = require("../../utils/token-store");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
/**
 * 提取用户信息
 */
function extractUserInfo(ctx) {
    let userId;
    let token;
    // 方法1: 直接从 ctx 获取（Agent 传递的，优先使用）
    if (ctx?.userId && ctx?.userToken) {
        userId = ctx.userId;
        token = ctx.userToken;
        console.log(`[search_notes] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[search_notes] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[search_notes] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 执行搜索备注操作
 */
async function executeSearchNotes(args, ctx) {
    console.log(`[工具] 🔍 search_notes(query: "${args.query}")`);
    try {
        // 1. 提取用户信息
        const { userId, token } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[search_notes] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!token) {
            console.error('[search_notes] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[search_notes] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(token);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 构建查询参数
        const params = new URLSearchParams();
        params.append('query', args.query.trim());
        if (args.project_id) {
            params.append('project_id', String(args.project_id));
        }
        if (args.subtask_id) {
            params.append('subtask_id', String(args.subtask_id));
        }
        if (args.mood) {
            params.append('mood', args.mood.toLowerCase());
        }
        if (args.start_date) {
            params.append('start_date', args.start_date);
        }
        if (args.end_date) {
            params.append('end_date', args.end_date);
        }
        if (args.limit) {
            params.append('limit', String(args.limit));
        }
        else {
            params.append('limit', '20'); // 默认值
        }
        // 4. 调用后端搜索 API
        const url = (0, config_1.getApiUrl)(`/api/v1/search/notes?${params}`);
        console.log(`[search_notes] 🌐 请求后端 API: ${url}`);
        const response = await axios_1.default.get(url, {
            headers: (0, config_1.getRequestHeaders)(token),
            timeout: 10000, // 10 秒超时
        });
        const searchData = response.data;
        console.log(`[search_notes] ✅ 搜索成功，找到 ${searchData.total || 0} 条结果`);
        // 5. 返回结果
        return searchData;
    }
    catch (error) {
        console.error(`[search_notes] ❌ 执行失败:`, error.message);
        // 处理HTTP错误响应
        if (error.response) {
            const status = error.response.status;
            const errorMsg = error.response.data?.detail ||
                error.response.data?.error ||
                error.message;
            if (status === 401) {
                return { ok: false, error: '认证失败，请重新登录' };
            }
            else if (status === 400) {
                return { ok: false, error: `参数错误: ${errorMsg}` };
            }
            else if (status === 500) {
                return { ok: false, error: '服务器错误，请稍后重试' };
            }
            else {
                return { ok: false, error: `API错误 (${status}): ${errorMsg}` };
            }
        }
        // 超时错误
        if (error.code === 'ECONNABORTED') {
            return { ok: false, error: '搜索超时，请稍后重试' };
        }
        // 网络错误
        if (error.code === 'ECONNREFUSED') {
            return { ok: false, error: '无法连接到服务器' };
        }
        return { ok: false, error: error.message };
    }
}
