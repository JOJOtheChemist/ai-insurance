/**
 * exam.json 格式 ↔ MCP API 格式转换器
 *
 * 用户友好格式 (exam.json) → MCP API 格式
 */
import { MCPClient } from '../http/client';
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
 * MCP API 格式（API 要求格式）
 */
export interface MCPScheduleFormat {
    schedules: MCPScheduleItem[];
}
/**
 * MCP API 中的单个日程
 */
export interface MCPScheduleItem {
    schedule_date: string;
    time_slot: string;
    planned_subtask_id?: number;
    planned_notes?: string;
    actual_subtask_id?: number;
    actual_notes?: string;
    mood?: string;
}
/**
 * 任务信息
 */
export interface Task {
    id: number;
    name: string;
    project_name?: string;
    category_name?: string;
}
/**
 * 转换选项
 */
export interface ConversionOptions {
    slot_interval?: number;
    mcpClient?: MCPClient;
    tasks?: Task[];
    fuzzyMatch?: boolean;
}
/**
 * 转换结果
 */
export interface ConversionResult {
    ok: boolean;
    data?: MCPScheduleFormat;
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
 * @param time 时间字符串，可能不是整半小时
 * @returns 规范化后的时间
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
 * exam.json 格式 → MCP API 格式
 */
export declare function examToMCP(examFormat: ExamScheduleFormat, options?: ConversionOptions): Promise<ConversionResult>;
/**
 * MCP API 格式 → exam.json 格式
 * （用于反向转换，可选）
 */
export declare function mcpToExam(mcpFormat: MCPScheduleFormat, tasks?: Task[]): ExamScheduleFormat;
/**
 * 合并相邻的相同任务时间槽（可选优化）
 */
export declare function mergeAdjacentSlots(examFormat: ExamScheduleFormat, interval?: number): ExamScheduleFormat;
/**
 * 打印转换结果摘要
 */
export declare function printConversionSummary(result: ConversionResult): void;
