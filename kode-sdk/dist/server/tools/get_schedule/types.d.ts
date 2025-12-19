/**
 * Get schedule tool type definitions
 */
/**
 * 日程记录接口
 */
export interface ScheduleRecord {
    id: number;
    schedule_date: string;
    time_slot: string;
    planned_subtask_id?: number;
    planned_notes?: string;
    actual_subtask_id?: number;
    actual_notes?: string;
    mood?: string;
}
/**
 * Get schedule 输入参数
 */
export interface GetScheduleInput {
    date: string;
}
/**
 * Get schedule 成功返回结果
 */
export interface GetScheduleSuccessResult {
    ok: true;
    data: {
        date: string;
        schedules: ScheduleRecord[];
        summary?: {
            total: number;
            completed: number;
            planned: number;
        };
    };
}
/**
 * Get schedule 错误返回结果
 */
export interface GetScheduleErrorResult {
    ok: false;
    error: string;
}
/**
 * Get schedule 返回结果
 */
export type GetScheduleResult = GetScheduleSuccessResult | GetScheduleErrorResult;
