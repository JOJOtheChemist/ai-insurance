/**
 * Delete subtasks tool validation logic
 */
import { DeleteSubtasksInput } from './types';
/**
 * 验证输入参数
 */
export declare function validateInput(args: DeleteSubtasksInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
