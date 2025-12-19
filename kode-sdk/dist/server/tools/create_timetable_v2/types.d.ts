/**
 * Create timetable tool type definitions
 */
/**
 * AI返回的时间槽格式（给AI的格式）
 */
export interface AITimeSlot {
    time_slot: string;
    planned_task?: string;
    planned_subtask?: string;
    planned_notes?: string;
    actual_task?: string;
    actual_subtask?: string;
    actual_notes?: string;
    mood?: string;
    planned_note_id?: number;
    actual_note_id?: number;
    time_blocks?: number[];
}
/**
 * AI返回的完整格式（日期作为key）
 */
export interface AIScheduleResponse {
    [date: string]: AITimeSlot[];
}
/**
 * Create timetable 输入参数（AI调用格式）
 */
export interface CreateTimetableInput {
    /** 时间表数据（日期作为key，时间槽数组作为value） */
    schedule: AIScheduleResponse;
}
/**
 * API需要的时间槽格式（带ID）
 */
export interface NotePayload {
    content: string;
    attachments?: Record<string, any>;
    tags?: string[];
}
/**
 * API需要的时间槽格式（带ID）
 */
export interface APITimeSlot {
    date: string;
    time_blocks?: number[];
    time_slot?: string;
    planned_project_id?: number;
    planned_subtask_id?: number;
    planned_note_id?: number;
    planned_note?: NotePayload;
    actual_project_id?: number;
    actual_subtask_id?: number;
    actual_note_id?: number;
    actual_note?: NotePayload;
    mood?: string;
}
/**
 * API批量创建请求格式
 */
export interface APIBatchRequest {
    time_slots: APITimeSlot[];
}
/**
 * 用户项目信息
 */
export interface UserProject {
    id: number;
    name: string;
    subtasks?: UserSubtask[];
}
/**
 * 用户子任务信息
 */
export interface UserSubtask {
    id: number;
    name: string;
    project_id: number;
}
/**
 * 时间表创建成功结果
 */
export interface CreatedTimetable {
    created_count: number;
    created_ids: number[];
    dates: string[];
}
/**
 * Create timetable 成功返回结果
 */
export interface CreateTimetableSuccessResult {
    ok: true;
    data: {
        success: boolean;
        message: string;
        timetable: CreatedTimetable;
    };
}
/**
 * Create timetable 错误返回结果
 */
export interface CreateTimetableErrorResult {
    ok: false;
    error: string;
}
/**
 * Create timetable 返回结果
 */
export type CreateTimetableResult = CreateTimetableSuccessResult | CreateTimetableErrorResult;
/**
 * 转换统计信息
 */
export interface ConversionStats {
    total_time_slots: number;
    matched_projects: number;
    matched_subtasks: number;
    unmatched_tasks: number;
    dates_covered: string[];
}
