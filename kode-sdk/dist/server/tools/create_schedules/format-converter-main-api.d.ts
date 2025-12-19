/**
 * exam.json 格式 ↔ 主后端 API 格式转换器
 *
 * 用户友好格式 (exam.json) → 主后端 API 格式
 * 替代原来的 MCP 格式转换器
 */
/**
 * exam.json 格式（用户友好格式）
 * 日期作为 key，时间槽数组作为 value
 */
export interface ExamScheduleFormat {
    [date: string]: ExamScheduleItem[];
}
/**
 * exam.json 中的单个时间槽
 */
export interface ExamScheduleItem {
    time_slot: string;
    planned_task?: string;
    planned_notes?: string;
    actual_task?: string;
    actual_notes?: string;
    mood?: string;
}
/**
 * 主后端 API 格式（批量创建时间表）
 */
export interface MainAPIScheduleFormat {
    time_slots: MainAPITimeSlot[];
}
/**
 * 主后端 API 中的单个时间槽
 */
export interface MainAPITimeSlot {
    date: string;
    time_block: number;
    mood: string | null;
    planned_project_id: number | null;
    planned_subtask_id: number | null;
    planned_note: string | null;
    actual_project_id: number | null;
    actual_subtask_id: number | null;
    actual_note: string | null;
}
/**
 * 任务信息（从主后端获取）
 */
export interface Task {
    id: number;
    name: string;
    project_id: number;
    project_name: string;
}
/**
 * 项目信息
 */
export interface Project {
    id: number;
    name: string;
    subtasks: Subtask[];
}
/**
 * 子任务信息
 */
export interface Subtask {
    id: number;
    name: string;
}
/**
 * 转换选项
 */
export interface ConversionOptions {
    slot_interval?: number;
    userToken?: string;
    tasks?: Task[];
    fuzzyMatch?: boolean;
}
/**
 * 转换结果
 */
export interface ConversionResult {
    ok: boolean;
    data?: MainAPIScheduleFormat;
    unmatchedTasks?: Array<{
        date: string;
        time_slot: string;
        task_name: string;
        type: 'planned' | 'actual';
    }>;
    warnings?: string[];
    error?: string;
}
/**
 * 规范化时间（确保是整半小时）
 */
export declare function normalizeTime(time: string): string;
/**
 * 拆分时间段为多个时间槽
 * @param timeSlot 时间槽，支持 "09:00" 或 "09:00-17:00"
 * @param interval 间隔（分钟）
 * @returns 时间点数组（所有时间都已规范化为整半小时）
 */
export declare function splitTimeSlot(timeSlot: string, interval?: number): string[];
/**
 * 时间转换为 time_block (0-47)
 * @param time 时间字符串 HH:MM
 * @returns time_block 编号（0-47）
 *
 * @example
 * timeToBlock("00:00") // → 0
 * timeToBlock("00:30") // → 1
 * timeToBlock("09:00") // → 18
 * timeToBlock("09:30") // → 19
 */
export declare function timeToBlock(time: string): number;
/**
 * time_block 转换为时间字符串（反向转换）
 */
export declare function blockToTime(block: number): string;
/**
 * exam.json 格式 → 主后端 API 格式
 *
 * @param examFormat exam.json 格式数据
 * @param options 转换选项
 * @returns 转换结果
 */
export declare function examToMainAPI(examFormat: ExamScheduleFormat, options?: ConversionOptions): Promise<ConversionResult>;
/**
 * 主后端 API 格式 → exam.json 格式
 * （用于反向转换，可选）
 */
export declare function mainAPIToExam(mainAPIFormat: MainAPIScheduleFormat, tasks?: Task[]): ExamScheduleFormat;
/**
 * 打印转换结果摘要
 */
export declare function printConversionSummary(result: ConversionResult): void;
/**
 * 验证转换后的数据
 */
export declare function validateMainAPIFormat(data: MainAPIScheduleFormat): {
    valid: boolean;
    errors: string[];
};
