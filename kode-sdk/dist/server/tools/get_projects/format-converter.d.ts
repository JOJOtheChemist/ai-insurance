/**
 * 主后端 API 格式 ↔ MCP 格式转换器
 *
 * 将主后端的项目列表格式转换为 MCP 工具返回格式
 */
/**
 * 主后端 API 返回的项目格式
 */
export interface MainAPIProject {
    id: number;
    name: string;
    category: string;
    is_completed: boolean;
    created_at?: string;
    updated_at?: string;
    subtasks: MainAPISubtask[];
}
/**
 * 主后端 API 返回的子任务格式
 */
export interface MainAPISubtask {
    id: number;
    name: string;
    is_completed: boolean;
    created_at?: string;
}
/**
 * 主后端 API 响应格式
 */
export interface MainAPIResponse {
    tasks: MainAPIProject[];
    total: number;
}
/**
 * MCP 格式的子任务
 */
export interface MCPSubtask {
    id: number;
    name: string;
    description?: string;
    status?: string;
    project_id: number;
}
/**
 * MCP 格式的项目
 */
export interface MCPProject {
    id: number;
    name: string;
    category: string;
    description?: string;
    subtasks: MCPSubtask[];
}
/**
 * 项目分类统计
 */
export interface CategoryStats {
    [category: string]: {
        projectCount: number;
        subtaskCount: number;
    };
}
/**
 * 项目数据汇总
 */
export interface ProjectsSummary {
    totalProjects: number;
    totalSubtasks: number;
    categoriesCount: number;
}
/**
 * MCP 工具返回的数据格式
 */
export interface MCPProjectsData {
    projects: MCPProject[];
    categories?: CategoryStats;
    summary?: ProjectsSummary;
}
/**
 * 主后端 API 格式 → MCP 格式
 *
 * @param apiResponse 主后端 API 响应
 * @returns MCP 格式的项目数据
 */
export declare function mainAPIToMCP(apiResponse: MainAPIResponse): MCPProjectsData;
/**
 * 打印转换结果摘要
 */
export declare function printConversionSummary(data: MCPProjectsData): void;
/**
 * 验证主后端 API 响应格式
 */
export declare function validateMainAPIResponse(response: any): {
    valid: boolean;
    errors: string[];
};
