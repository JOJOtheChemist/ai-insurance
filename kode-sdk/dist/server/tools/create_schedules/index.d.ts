/**
 * 自然语言转换工具 - 使用 tool 方法定义
 *
 * 功能：将用户的自然语言描述转换为结构化的时间槽格式（exam.json）
 */
import { GLMClient } from '../../utils/glm-client';
/**
 * 获取用户已有的任务列表（从主后端 API）
 */
declare function getAvailableTasks(userToken?: string): Promise<{
    id: number;
    name: string;
    project: string;
    category: string;
}[]>;
/**
 * 调用 GLM 解析并验证（带自动重试）
 */
declare function parseWithGLMAndValidate(userInput: string, systemPrompt: string, availableTaskNames: string[], maxRetry: number, glmClient: GLMClient): Promise<any>;
/**
 * 创建日程工具 - 从自然语言创建日程记录
 *
 * 使用 tool 方法定义，将用户关于日程的自然语言描述解析为时间槽格式，
 * 包括任务、心情、随想等信息，并最终创建到日程系统中。
 */
export declare const createScheduleTool: import("../../../src").ToolInstance;
export type { ScheduleInput, BatchCreateInput, Task as TaskType, MatchMethod, MatchResult, CreateResult, PendingItem, BatchCreateResult, } from './types';
export { validateScheduleData } from './validator';
export type { ValidationResult } from './validator';
export { buildSystemPrompt, buildRetryPrompt } from './prompt';
export type { PromptBuildResult } from './prompt';
export { examToMainAPI, printConversionSummary, } from './format-converter-main-api';
export { processAIParsedSchedule, } from './natural-language-tool';
export declare const naturalLanguageToStructuredTool: import("../../../src").ToolInstance;
export { getAvailableTasks, parseWithGLMAndValidate };
