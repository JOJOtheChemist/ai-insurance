/**
 * Get schedule tool type definitions
 */
/**
 * v2 合并后的时间段段落（一个或多个连续的 time_blocks）
 */
export interface V2ScheduleSegment {
    /** 段落所属日期，格式 YYYY-MM-DD */
    date: string;
    /** 段落涵盖的 time_block 列表，例如 [18,19,20] 表示 09:00-10:30 */
    time_blocks: number[];
    /** 人类可读的时间范围，例如 "09:00-10:30" */
    time_range: string;
    /** 段落整体的心情（通常来自实际轨道） */
    mood?: string;
    planned_project_id?: number;
    planned_subtask_id?: number;
    planned_note_id?: number;
    planned_note_content?: string | null;
    planned_note_tags?: string[];
    planned_note_attachments?: Record<string, any>;
    actual_project_id?: number;
    actual_subtask_id?: number;
    actual_note_id?: number;
    actual_note_content?: string | null;
    actual_note_tags?: string[];
    actual_note_attachments?: Record<string, any>;
}
/**
 * Get schedule v2 输入参数
 */
export interface GetScheduleInput {
    date: string;
}
/**
 * Get schedule v2 成功返回结果
 */
export interface GetScheduleSuccessResult {
    ok: true;
    data: {
        date: string;
        /** 当天合并后的时间段列表（每一项对应后端的 V2MergedSlotItem） */
        segments: V2ScheduleSegment[];
    };
}
/**
 * Get schedule v2 错误返回结果
 */
export interface GetScheduleErrorResult {
    ok: false;
    error: string;
}
/**
 * Get schedule v2 返回结果
 */
export type GetScheduleResult = GetScheduleSuccessResult | GetScheduleErrorResult;
