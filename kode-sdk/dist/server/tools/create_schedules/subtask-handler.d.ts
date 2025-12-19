/**
 * 子任务处理器 - 处理未匹配的子任务，尝试自动创建
 */
import { MainAPIClient } from './main-api-client';
/**
 * 未匹配的任务信息
 */
export interface UnmatchedTask {
    date: string;
    time_slot: string;
    task_name: string;
    type: 'planned' | 'actual';
    notes?: string;
}
/**
 * 子任务创建结果
 */
export interface SubtaskCreationResult {
    ok: boolean;
    taskName: string;
    subtaskId?: number;
    projectName?: string;
    error?: string;
}
/**
 * 批量创建结果
 */
export interface BatchSubtaskCreationResult {
    success: SubtaskCreationResult[];
    failed: SubtaskCreationResult[];
    totalCount: number;
    successCount: number;
    failedCount: number;
}
/**
 * 批量创建未匹配的子任务
 */
export declare function createMissingSubtasks(unmatchedTasks: UnmatchedTask[], mainAPIClient: MainAPIClient): Promise<BatchSubtaskCreationResult>;
/**
 * 生成友好的提示消息给用户
 */
export declare function generateUserPrompt(result: BatchSubtaskCreationResult): string;
