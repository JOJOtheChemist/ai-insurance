/**
 * Delete timetable tool type definitions
 */
/**
 * AI返回的删除时间槽格式（给AI的格式）
 */
export interface AIDeleteTimeSlot {
    time_slot: string;
}
/**
 * AI返回的删除格式（日期作为key）
 */
export interface AIDeleteScheduleResponse {
    [date: string]: AIDeleteTimeSlot[];
}
/**
 * Delete timetable 输入参数（AI调用格式）
 */
export interface DeleteTimetableInput {
    /** 要删除的时间表数据（日期作为key，时间槽数组作为value） */
    schedule: AIDeleteScheduleResponse;
}
/**
 * 后端时间段记录格式（从get_schedule API获取）
 */
export interface TimeSlotRecord {
    id: number;
    date: string;
    time_block: number;
    planned_project_id?: number;
    planned_subtask_id?: number;
    planned_note?: string;
    actual_project_id?: number;
    actual_subtask_id?: number;
    actual_note?: string;
    mood?: string;
}
/**
 * 时间表删除成功结果
 */
export interface DeletedTimetable {
    deleted_count: number;
    requested_count: number;
    deleted_ids: number[];
}
/**
 * Delete timetable 成功返回结果
 */
export interface DeleteTimetableSuccessResult {
    ok: true;
    data: {
        deleted_count: number;
        requested_count: number;
        deleted_ids: number[];
        message: string;
    };
}
/**
 * Delete timetable 错误返回结果
 */
export interface DeleteTimetableErrorResult {
    ok: false;
    error: string;
}
/**
 * Delete timetable 返回结果
 */
export type DeleteTimetableResult = DeleteTimetableSuccessResult | DeleteTimetableErrorResult;
/**
 * 日期和时间块范围
 */
export interface DateBlockRange {
    date: string;
    startBlock: number;
    endBlock: number;
}
