/**
 * Prompt 构建层
 *
 * 负责：
 * - 构建包含任务列表的系统提示词
 * - 格式化任务列表
 * - 提供 JSON 格式说明和示例
 */
export interface Task {
    id: number;
    name: string;
    project?: string;
    category?: string;
}
export interface PromptBuildResult {
    /** 完整的系统提示词 */
    systemPrompt: string;
    /** 可用的任务名列表（用于后续验证） */
    availableTaskNames: string[];
}
/**
 * 构建包含任务列表的系统提示词
 */
export declare function buildSystemPrompt(tasks: Task[], customDate?: string): PromptBuildResult;
/**
 * 构建验证失败后的重试提示词
 */
export declare function buildRetryPrompt(errors: Array<{
    task: string;
    field: string;
}>): string;
