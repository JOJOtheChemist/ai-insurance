/**
 * Delete timetable input validator
 */
import { DeleteTimetableInput, AIDeleteScheduleResponse } from './types';
/**
 * 提取并验证所有有效日期
 */
export declare function extractValidDates(schedule: AIDeleteScheduleResponse): string[];
/**
 * 验证输入参数
 */
export declare function validateInput(args: DeleteTimetableInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
