/**
 * Get projects tool validation logic
 */
import { GetProjectsInput } from './types';
/**
 * 验证输入参数
 * 由于此工具不需要参数，验证总是通过
 */
export declare function validateInput(args: GetProjectsInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
