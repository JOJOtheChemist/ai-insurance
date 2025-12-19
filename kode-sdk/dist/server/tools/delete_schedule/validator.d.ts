/**
 * Delete schedule tool validation logic
 * 批量删除时间段工具验证逻辑
 */
import { DeleteScheduleInput } from './types';
/**
 * 验证输入参数
 * 验证时间段ID列表的有效性
 */
export declare function validateInput(args: DeleteScheduleInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
