/**
 * 重试处理器 - 处理日程创建重试逻辑
 */
import { MainAPIClient } from './main-api-client';
import { ExamScheduleFormat } from './format-converter';
import { SubtaskCreationResult } from './subtask-handler';
/**
 * 重试上下文 - 保存失败的日程信息
 */
export interface RetryContext {
    originalData: ExamScheduleFormat;
    unmatchedTaskNames: Set<string>;
    createdSubtasks: Map<string, number>;
}
/**
 * 重试结果
 */
export interface RetryResult {
    ok: boolean;
    retriedCount: number;
    successCount: number;
    skippedCount: number;
    error?: string;
    saveResult?: any;
}
/**
 * 创建重试上下文
 */
export declare function createRetryContext(originalData: ExamScheduleFormat, unmatchedTasks: Array<{
    task_name: string;
    type: 'planned' | 'actual';
}>, createdSubtasks: SubtaskCreationResult[]): RetryContext;
/**
 * 执行重试逻辑
 */
export declare function retryFailedSchedules(context: RetryContext, mainAPIClient: MainAPIClient, userToken: string): Promise<RetryResult>;
/**
 * 生成重试结果的友好消息
 */
export declare function generateRetryMessage(result: RetryResult): string;
