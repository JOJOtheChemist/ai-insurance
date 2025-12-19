/**
 * Delete subtasks tool type definitions
 */
/**
 * 删除项（单个）
 */
export interface DeleteItem {
    project_id: number;
    subtask_id: string;
}
/**
 * Delete subtasks 输入参数
 */
export interface DeleteSubtasksInput {
    items: DeleteItem[];
}
/**
 * 删除结果项
 */
export interface DeleteResultItem {
    project_id: number;
    subtask_id: string;
    success: boolean;
    message: string;
}
/**
 * 删除结果数据
 */
export interface DeletedSubtasksData {
    success: boolean;
    message: string;
    deleted_count: number;
    failed_count: number;
    results: DeleteResultItem[];
}
/**
 * Delete subtasks 成功返回结果
 */
export interface DeleteSubtasksSuccessResult {
    ok: true;
    data: DeletedSubtasksData;
}
/**
 * Delete subtasks 错误返回结果
 */
export interface DeleteSubtasksErrorResult {
    ok: false;
    error: string;
}
/**
 * Delete subtasks 返回结果
 */
export type DeleteSubtasksResult = DeleteSubtasksSuccessResult | DeleteSubtasksErrorResult;
