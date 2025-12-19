/**
 * Delete subtasks tool execution logic
 */
import { DeleteSubtasksInput, DeleteSubtasksResult } from './types';
/**
 * 执行删除子任务操作
 * 支持单个或批量删除
 */
export declare function executeDeleteSubtasks(args: DeleteSubtasksInput, ctx?: any): Promise<DeleteSubtasksResult>;
