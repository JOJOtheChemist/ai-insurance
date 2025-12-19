"use strict";
/**
 * 主后端 API 客户端
 *
 * 用于与 ai-time 主后端进行交互
 * 替代原来的 MCP 客户端
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAPIClient = void 0;
exports.createMainAPIClient = createMainAPIClient;
exports.getFlattenedTasks = getFlattenedTasks;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
/**
 * 主后端 API 客户端
 */
class MainAPIClient {
    constructor(config) {
        this.userId = null;
        this.baseURL = config.baseURL || config_1.API_CONFIG.BASE_URL;
        this.userToken = config.userToken;
        this.timeout = config.timeout || config_1.API_CONFIG.TIMEOUT;
        // 从 JWT token 解析 user_id（使用统一的配置函数）
        this.userId = (0, config_1.parseUserIdFromToken)(this.userToken);
        if (this.userId) {
            console.log(`[主后端API] 🔑 从 JWT 解析用户ID: ${this.userId}`);
        }
        else {
            console.warn('[主后端API] ⚠️  无法从 JWT 解析用户ID，将使用默认值');
        }
    }
    /**
     * 通用请求方法
     */
    async request(endpoint, options = {}) {
        const { method = 'GET', body, queryParams } = options;
        // 构建完整 URL
        let url = `${this.baseURL}${endpoint}`;
        if (queryParams) {
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(queryParams)) {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            }
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        // 构建请求选项（使用统一的 headers）
        const fetchOptions = {
            method,
            headers: (0, config_1.getRequestHeaders)(this.userToken),
            timeout: this.timeout,
        };
        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }
        console.log(`[主后端API] ${method} ${url}`);
        try {
            const response = await (0, node_fetch_1.default)(url, fetchOptions);
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData.detail) {
                        errorMessage = errorData.detail;
                    }
                }
                catch (e) {
                    // 无法解析错误响应，使用默认错误消息
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log(`[主后端API] ✅ 请求成功`);
            return data;
        }
        catch (error) {
            console.error(`[主后端API] ❌ 请求失败:`, error.message);
            throw error;
        }
    }
    /**
     * 获取用户的所有项目和子任务
     *
     * @returns 项目列表
     */
    async getProjects() {
        console.log('[主后端API] 📋 获取项目列表...');
        if (!this.userId) {
            throw new Error('缺少用户ID，无法获取项目列表');
        }
        const response = await this.request('/api/v1/tasks', {
            method: 'GET',
            queryParams: { user_id: this.userId },
        });
        console.log(`[主后端API] ✅ 获取到 ${response.tasks?.length || 0} 个项目`);
        return response;
    }
    /**
     * 批量创建时间表
     *
     * @param scheduleData 时间表数据（主后端 API 格式）
     * @param userId 用户ID（可选，会从token中解析）
     * @returns 创建结果
     */
    async batchCreateTimeSlots(scheduleData, userId) {
        console.log('[主后端API] 📤 批量创建时间表...');
        console.log(`[主后端API] 时间槽数量: ${scheduleData.time_slots.length}`);
        const finalUserId = userId || this.userId;
        if (!finalUserId) {
            throw new Error('缺少用户ID，无法创建时间表');
        }
        const response = await this.request('/api/v1/schedule/time-slots/batch', {
            method: 'POST',
            body: scheduleData,
            queryParams: { user_id: finalUserId },
        });
        console.log(`[主后端API] ✅ 成功创建 ${response.created_count} 个时间槽`);
        return response;
    }
    /**
     * 获取指定日期的时间表
     *
     * @param date 日期 (YYYY-MM-DD)
     * @returns 时间表数据
     */
    async getTimeSlotsByDate(date) {
        console.log(`[主后端API] 📅 获取 ${date} 的时间表...`);
        if (!this.userId) {
            throw new Error('缺少用户ID，无法获取时间表');
        }
        return await this.request(`/api/v1/schedule/time-slots`, {
            method: 'GET',
            queryParams: { date, user_id: this.userId },
        });
    }
    /**
     * 创建新的子任务
     *
     * @param projectId 项目ID
     * @param subtaskName 子任务名称
     * @returns 创建的子任务信息
     */
    async createSubtask(projectId, subtaskName) {
        console.log(`[主后端API] ➕ 创建子任务: ${subtaskName} (项目ID: ${projectId})`);
        if (!this.userId) {
            throw new Error('缺少用户ID，无法创建子任务');
        }
        const response = await this.request(`/api/v1/tasks/${projectId}/subtasks`, {
            method: 'POST',
            body: { name: subtaskName },
            queryParams: { user_id: this.userId },
        });
        console.log(`[主后端API] ✅ 子任务创建成功，ID: ${response.id}`);
        return response;
    }
    /**
     * 创建新的项目
     *
     * @param projectName 项目名称
     * @param category 项目分类
     * @returns 创建的项目信息
     */
    async createProject(projectName, category = '学习') {
        console.log(`[主后端API] ➕ 创建项目: ${projectName} (分类: ${category})`);
        if (!this.userId) {
            throw new Error('缺少用户ID，无法创建项目');
        }
        const response = await this.request('/api/v1/tasks', {
            method: 'POST',
            body: {
                name: projectName,
                category: category,
            },
            queryParams: { user_id: this.userId },
        });
        console.log(`[主后端API] ✅ 项目创建成功，ID: ${response.id}`);
        return response;
    }
    /**
     * 更新用户 token（用于 token 刷新）
     */
    updateToken(newToken) {
        this.userToken = newToken;
        console.log('[主后端API] 🔄 Token 已更新');
    }
}
exports.MainAPIClient = MainAPIClient;
/**
 * 创建主后端 API 客户端
 *
 * @param userToken JWT token
 * @param baseURL 主后端地址（可选）
 * @returns API 客户端实例
 */
function createMainAPIClient(userToken, baseURL) {
    return new MainAPIClient({
        baseURL,
        userToken,
    });
}
/**
 * 从主后端获取扁平化的任务列表（用于任务匹配）
 *
 * @param client API 客户端
 * @returns 扁平化的任务列表
 */
async function getFlattenedTasks(client) {
    const response = await client.getProjects();
    const tasks = [];
    for (const project of response.tasks || []) {
        for (const subtask of project.subtasks || []) {
            tasks.push({
                id: subtask.id,
                name: subtask.name,
                project_id: project.id,
                project_name: project.name,
                category: project.category,
            });
        }
    }
    return tasks;
}
