"use strict";
/**
 * Create subtask tool execution logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCreateSubtask = executeCreateSubtask;
const token_store_1 = require("../../utils/token-store");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
/**
 * 从主后端 API 获取所有项目列表
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
            category_name: task.category,
            color: task.color,
        }));
        console.log(`[create_subtask] 获取到 ${projects.length} 个项目`);
        return projects;
    }
    catch (error) {
        console.error('[create_subtask] 获取项目列表失败:', error.message);
        return [];
    }
}
/**
 * 模糊匹配项目（参考 create_schedules 的 fuzzyMatchTask 逻辑）
 */
function fuzzyMatchProject(projectInput, projects) {
    const lowerInput = projectInput.toLowerCase().trim();
    // 1. 完全匹配
    const exactMatch = projects.find(p => p.name.toLowerCase() === lowerInput);
    if (exactMatch)
        return exactMatch;
    // 2. 包含匹配
    const containsMatch = projects.find(p => p.name.toLowerCase().includes(lowerInput) ||
        lowerInput.includes(p.name.toLowerCase()));
    if (containsMatch)
        return containsMatch;
    // 3. 去除空格后匹配
    const noSpaceInput = lowerInput.replace(/\s+/g, '');
    const noSpaceMatch = projects.find(p => p.name.toLowerCase().replace(/\s+/g, '') === noSpaceInput);
    if (noSpaceMatch)
        return noSpaceMatch;
    return null;
}
/**
 * 将中文分类映射为英文type
 * @param category 中文分类（学习/生活/工作/娱乐）
 * @returns 英文type (study/life/work/play)
 */
function mapCategoryToType(category) {
    const categoryMap = {
        '学习': 'study',
        '生活': 'life',
        '工作': 'work',
        '娱乐': 'play',
    };
    return categoryMap[category] || 'study'; // 默认为study
}
/**
 * 解析项目参数，返回项目ID
 * @param project 项目参数（可以是ID或名称）
 * @param category 项目分类（学习/生活/工作/娱乐）
 * @param token 用户Token
 * @param userId 用户ID
 * @returns 项目ID
 */
async function resolveProjectId(project, category, token, userId) {
    // 如果是数字，直接返回
    if (typeof project === 'number') {
        console.log(`[create_subtask] 使用项目ID: ${project}`);
        return project;
    }
    // 如果是字符串，尝试解析为数字
    const projectAsNumber = Number(project);
    if (!isNaN(projectAsNumber) && projectAsNumber > 0) {
        console.log(`[create_subtask] 将字符串 "${project}" 解析为项目ID: ${projectAsNumber}`);
        return projectAsNumber;
    }
    // 字符串且不是数字，作为项目名称处理
    console.log(`[create_subtask] 查找项目: "${project}"`);
    // Step 1: 获取所有项目
    const projects = await getAllProjects(token, userId);
    console.log(`[create_subtask] 获取到 ${projects.length} 个项目`);
    if (projects.length === 0) {
        console.log('[create_subtask] ⚠️  没有可用项目，将创建新项目');
    }
    // Step 2: 模糊匹配项目
    const matchedProject = fuzzyMatchProject(project, projects);
    if (matchedProject) {
        console.log(`[create_subtask] ✅ 找到匹配项目: "${matchedProject.name}" (ID: ${matchedProject.id})`);
        return matchedProject.id;
    }
    // Step 3: 没有匹配，创建新项目
    console.log(`[create_subtask] 未找到匹配项目，创建新项目: "${project}"，分类: "${category}"`);
    // 将中文分类映射为英文type
    const projectType = mapCategoryToType(category);
    console.log(`[create_subtask] 映射分类: "${category}" -> type: "${projectType}"`);
    try {
        const url = (0, config_1.getApiUrl)(`/api/v1/tasks?user_id=${userId}`);
        const response = await axios_1.default.post(url, {
            name: project,
            category: category, // ✅ 使用AI传来的中文category
            type: projectType, // ✅ 同时传递英文type（双重保险）
            subtasks: [],
        }, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const newProject = response.data;
        console.log(`[create_subtask] ✅ 成功创建新项目: "${project}" (ID: ${newProject.id})，分类: "${category}"，type: "${projectType}"`);
        return newProject.id;
    }
    catch (createError) {
        console.error(`[create_subtask] 创建项目失败:`, createError.message);
        throw new Error(`无法创建项目 "${project}": ${createError.response?.data?.detail || createError.message}`);
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
        console.log(`[create_subtask] 从ctx直接获取用户信息: ${userId}`);
        return { userId, token };
    }
    // 方法2: 从 ctx.agent.id 提取userId（格式: userId:sessionId:agentId）
    const fullAgentId = ctx?.agent?.id;
    if (fullAgentId && fullAgentId.includes(':')) {
        userId = fullAgentId.split(':')[0];
        console.log(`[create_subtask] 从agent.id提取userId: ${userId}`);
    }
    // 方法3: 从 ctx.agentId (sessionId) 查找userId映射
    if (!userId && ctx?.agentId) {
        userId = token_store_1.tokenStore.getUserBySession(ctx.agentId);
        console.log(`[create_subtask] 从session映射查找userId: ${userId} (sessionId: ${ctx.agentId})`);
    }
    // 获取用户Token
    token = userId ? token_store_1.tokenStore.get(userId) : undefined;
    return { userId, token };
}
/**
 * 执行创建子任务操作
 */
async function executeCreateSubtask(args, ctx) {
    console.log('[工具] 🚀 create_subtask():', JSON.stringify(args, null, 2));
    try {
        // 1. 提取用户信息
        const { userId, token } = extractUserInfo(ctx);
        if (!userId) {
            console.error('[create_subtask] ❌ 无法确定用户ID');
            return {
                ok: false,
                error: '无法确定用户ID，请确保已登录'
            };
        }
        if (!token) {
            console.error('[create_subtask] ❌ 未找到用户Token');
            return {
                ok: false,
                error: `未找到用户 ${userId} 的认证Token`
            };
        }
        console.log(`[create_subtask] ✅ 使用用户 ${userId} 的Token`);
        // 2. 从Token中解析用户ID（用于API请求）
        const numericUserId = (0, config_1.parseUserIdFromToken)(token);
        if (!numericUserId) {
            return {
                ok: false,
                error: '无法从Token中解析用户ID'
            };
        }
        // 3. 智能解析项目参数（支持ID或名称，支持模糊匹配，自动创建）
        const projectId = await resolveProjectId(args.project, args.category, token, numericUserId);
        // 4. 调用后端 API 创建子任务（使用统一配置）
        const url = (0, config_1.getApiUrl)(`/api/v1/tasks/${projectId}/subtasks?user_id=${numericUserId}`);
        console.log(`[create_subtask] 🌐 请求后端 API: ${url}`);
        const response = await axios_1.default.post(url, { name: args.name }, {
            headers: (0, config_1.getRequestHeaders)(token),
        });
        const subtask = response.data;
        console.log(`[create_subtask] ✅ 成功创建子任务: ${subtask.name} (ID: ${subtask.id})`);
        return {
            ok: true,
            data: {
                success: true,
                message: '子任务创建成功',
                subtask: {
                    id: subtask.id,
                    project_id: subtask.project_id,
                    name: subtask.name,
                    priority: args.priority,
                    urgency_importance: args.urgency_importance,
                    difficulty: args.difficulty,
                    color: args.color,
                }
            }
        };
    }
    catch (error) {
        console.error(`[create_subtask] ❌ 执行失败:`, error.message);
        // 处理HTTP错误响应
        if (error.response) {
            const errorMsg = error.response.data?.detail || error.response.data?.message || error.message;
            return { ok: false, error: `API错误: ${errorMsg}` };
        }
        return { ok: false, error: error.message };
    }
}
