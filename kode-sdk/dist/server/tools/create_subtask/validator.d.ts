/**
 * Create subtask tool validation logic
 */
import { CreateSubtaskInput } from './types';
/**
 * 验证输入参数
 */
export declare function validateInput(args: CreateSubtaskInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
