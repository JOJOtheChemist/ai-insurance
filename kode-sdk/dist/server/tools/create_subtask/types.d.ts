/**
 * Create subtask tool type definitions
 */
/**
 * Create subtask 输入参数
 */
export interface CreateSubtaskInput {
    /** 所属项目（可以是项目ID或项目名称，会自动匹配） */
    project: string | number;
    /** 项目分类（必填）：学习/生活/工作/娱乐 */
    category: string;
    /** 子任务名称（必填） */
    name: string;
    /** 优先级（可选） */
    priority?: string;
    /** 紧急重要程度（可选） */
    urgency_importance?: string;
    /** 难度级别（可选） */
    difficulty?: string;
    /** 颜色标识（可选） */
    color?: string;
}
/**
 * 创建的子任务信息
 */
export interface CreatedSubtask {
    id: number;
    project_id: number;
    name: string;
    priority?: string;
    urgency_importance?: string;
    difficulty?: string;
    difficulty_class?: string;
    color?: string;
}
/**
 * Create subtask 成功返回结果
 */
export interface CreateSubtaskSuccessResult {
    ok: true;
    data: {
        success: boolean;
        message: string;
        subtask: CreatedSubtask;
    };
}
/**
 * Create subtask 错误返回结果
 */
export interface CreateSubtaskErrorResult {
    ok: false;
    error: string;
}
/**
 * Create subtask 返回结果
 */
export type CreateSubtaskResult = CreateSubtaskSuccessResult | CreateSubtaskErrorResult;
/**
 * 项目信息（用于匹配）
 */
export interface ProjectInfo {
    id: number;
    name: string;
    category_name?: string;
    color?: string;
}
