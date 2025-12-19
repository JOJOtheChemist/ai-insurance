"use strict";
/**
 * Get projects tool execution logic
 *
 * 从主后端 API 获取项目列表，而不是通过 MCP
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeGetProjects = executeGetProjects;
const node_fetch_1 = __importDefault(require("node-fetch"));
const token_store_1 = require("../../utils/token-store");
const format_converter_1 = require("./format-converter");
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
        console.log(`[get_projects] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[get_projects] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[get_projects] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 调用主后端 API 获取项目列表
 */
async function fetchProjectsFromMainAPI(token, userId) {
    const url = (0, config_1.getApiUrl)(`/api/v1/tasks?user_id=${userId}`);
    console.log(`[get_projects] 🌐 请求主后端 API: ${url}`);
    const response = await (0, node_fetch_1.default)(url, {
        method: 'GET',
        headers: (0, config_1.getRequestHeaders)(token),
    });
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        }
        catch (e) {
            // 无法解析错误响应
        }
        throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log(`[get_projects] ✅ API 响应成功`);
    return data;
}
/**
 * 执行获取项目列表操作
 */
async function executeGetProjects(args, ctx) {
    console.log('[工具] 🚀 get_projects() - 从主后端获取项目列表');
    try {
        // 1. 提取用户信息
        const { userId, token } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[get_projects] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!token) {
            console.error('[get_projects] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[get_projects] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(token);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 调用主后端 API
        const apiResponse = await fetchProjectsFromMainAPI(token, numericUserId);
        // 4. 验证响应格式
        const validation = (0, format_converter_1.validateMainAPIResponse)(apiResponse);
        if (!validation.valid) {
            console.error('[get_projects] ❌ API响应格式验证失败:', validation.errors);
            return {
                ok: false,
                error: `API响应格式错误: ${validation.errors.join(', ')}`
            };
        }
        // 5. 转换为MCP格式
        const mcpData = (0, format_converter_1.mainAPIToMCP)(apiResponse);
        // 6. 打印摘要（可选）
        if (process.env.DEBUG === 'true') {
            (0, format_converter_1.printConversionSummary)(mcpData);
        }
        console.log('[get_projects] ✅ 成功获取项目列表');
        console.log(`[get_projects] 📊 ${mcpData.projects.length} 个项目, ${mcpData.summary?.totalSubtasks} 个子任务`);
        return { ok: true, data: mcpData };
    }
    catch (error) {
        console.error(`[get_projects] ❌ 执行失败:`, error.message);
        return {
            ok: false,
            error: `获取项目列表失败: ${error.message}`
        };
    }
}
