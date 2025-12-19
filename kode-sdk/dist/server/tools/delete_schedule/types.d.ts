/**
 * Delete schedule tool type definitions
 * 批量删除时间段工具类型定义
 */
/**
 * Delete schedule 输入参数
 * 与后端批量删除API格式一致
 */
export interface DeleteScheduleInput {
    slot_ids: number[];
}
/**
 * 删除结果数据
 */
export interface DeletedScheduleData {
    deleted_count: number;
    requested_count: number;
    deleted_ids: number[];
    message?: string;
}
/**
 * Delete schedule 成功返回结果
 */
export interface DeleteScheduleSuccessResult {
    ok: true;
    data: DeletedScheduleData;
}
/**
 * Delete schedule 错误返回结果
 */
export interface DeleteScheduleErrorResult {
    ok: false;
    error: string;
}
/**
 * Delete schedule 返回结果
 */
export type DeleteScheduleResult = DeleteScheduleSuccessResult | DeleteScheduleErrorResult;
