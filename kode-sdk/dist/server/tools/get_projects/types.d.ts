/**
 * Get projects tool type definitions
 */
/**
 * 子任务接口
 */
export interface Subtask {
    id: number;
    name: string;
    description?: string;
    status?: string;
    project_id: number;
}
/**
 * 项目接口
 */
export interface Project {
    id: number;
    name: string;
    category: string;
    description?: string;
    subtasks: Subtask[];
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
 * Get projects 输入参数（无需参数）
 */
export interface GetProjectsInput {
}
/**
 * Get projects 成功返回结果
 */
export interface GetProjectsSuccessResult {
    ok: true;
    data: {
        projects: Project[];
        categories?: CategoryStats;
        summary?: ProjectsSummary;
    };
}
/**
 * Get projects 错误返回结果
 */
export interface GetProjectsErrorResult {
    ok: false;
    error: string;
}
/**
 * Get projects 返回结果
 */
export type GetProjectsResult = GetProjectsSuccessResult | GetProjectsErrorResult;
