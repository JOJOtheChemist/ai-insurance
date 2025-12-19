/**
 * Create timetable tool validation logic
 */
import { CreateTimetableInput, AIScheduleResponse } from './types';
/**
 * 验证输入参数
 */
export declare function validateInput(args: CreateTimetableInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
/**
 * 验证并提取有效日期
 */
export declare function extractValidDates(schedule: AIScheduleResponse): string[];
