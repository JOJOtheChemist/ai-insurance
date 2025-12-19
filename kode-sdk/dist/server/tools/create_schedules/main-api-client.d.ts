/**
 * 主后端 API 客户端
 *
 * 用于与 ai-time 主后端进行交互
 * 替代原来的 MCP 客户端
 */
import type { MainAPIScheduleFormat } from './format-converter-main-api';
/**
 * API 客户端配置
 */
export interface MainAPIClientConfig {
    baseURL?: string;
    userToken: string;
    timeout?: number;
}
/**
 * 项目信息（从主后端返回）
 */
export interface Project {
    id: number;
    name: string;
    category: string;
    is_completed: boolean;
    subtasks: Subtask[];
    created_at?: string;
    updated_at?: string;
}
/**
 * 子任务信息
 */
export interface Subtask {
    id: number;
    name: string;
    is_completed: boolean;
    created_at?: string;
}
/**
 * 获取项目列表的响应
 */
export interface GetProjectsResponse {
    tasks: Project[];
    total: number;
}
/**
 * 批量创建时间表的响应
 */
export interface BatchCreateResponse {
    success: boolean;
    message: string;
    created_count: number;
    created_ids: number[];
}
/**
 * API 错误响应
 */
export interface APIError {
    detail: string;
}
/**
 * 主后端 API 客户端
 */
export declare class MainAPIClient {
    private baseURL;
    private userToken;
    private timeout;
    private userId;
    constructor(config: MainAPIClientConfig);
    /**
     * 通用请求方法
     */
    private request;
    /**
     * 获取用户的所有项目和子任务
     *
     * @returns 项目列表
     */
    getProjects(): Promise<GetProjectsResponse>;
    /**
     * 批量创建时间表
     *
     * @param scheduleData 时间表数据（主后端 API 格式）
     * @param userId 用户ID（可选，会从token中解析）
     * @returns 创建结果
     */
    batchCreateTimeSlots(scheduleData: MainAPIScheduleFormat, userId?: number): Promise<BatchCreateResponse>;
    /**
     * 获取指定日期的时间表
     *
     * @param date 日期 (YYYY-MM-DD)
     * @returns 时间表数据
     */
    getTimeSlotsByDate(date: string): Promise<any>;
    /**
     * 创建新的子任务
     *
     * @param projectId 项目ID
     * @param subtaskName 子任务名称
     * @returns 创建的子任务信息
     */
    createSubtask(projectId: number, subtaskName: string): Promise<Subtask>;
    /**
     * 创建新的项目
     *
     * @param projectName 项目名称
     * @param category 项目分类
     * @returns 创建的项目信息
     */
    createProject(projectName: string, category?: string): Promise<Project>;
    /**
     * 更新用户 token（用于 token 刷新）
     */
    updateToken(newToken: string): void;
}
/**
 * 创建主后端 API 客户端
 *
 * @param userToken JWT token
 * @param baseURL 主后端地址（可选）
 * @returns API 客户端实例
 */
export declare function createMainAPIClient(userToken: string, baseURL?: string): MainAPIClient;
/**
 * 从主后端获取扁平化的任务列表（用于任务匹配）
 *
 * @param client API 客户端
 * @returns 扁平化的任务列表
 */
export declare function getFlattenedTasks(client: MainAPIClient): Promise<{
    id: number;
    name: string;
    project_id: number;
    project_name: string;
    category: string;
}[]>;
