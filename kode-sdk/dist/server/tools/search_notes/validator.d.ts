/**
 * 搜索工具参数验证
 */
import { SearchNotesInput } from './types';
export declare function validateInput(args: SearchNotesInput): {
    valid: boolean;
    error?: string;
};
