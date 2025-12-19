/**
 * Get schedule tool validation logic
 */
import { GetScheduleInput } from './types';
/**
 * 验证日期格式是否正确
 */
export declare function validateDateFormat(date: string): boolean;
/**
 * 验证日期是否有效（考虑月份天数、闰年等）
 */
export declare function validateDate(date: string): boolean;
/**
 * 验证输入参数
 */
export declare function validateInput(args: GetScheduleInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
