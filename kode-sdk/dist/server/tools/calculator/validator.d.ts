/**
 * Calculator tool validation logic
 */
import { CalculatorInput, OperationType } from './types';
/**
 * 验证运算类型是否有效
 */
export declare function validateOperation(operation: string): operation is OperationType;
/**
 * 验证输入参数
 */
export declare function validateInput(args: CalculatorInput): {
    valid: true;
} | {
    valid: false;
    error: string;
};
