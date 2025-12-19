/**
 * Calculator tool type definitions
 */
/**
 * 支持的运算类型
 */
export type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';
/**
 * Calculator 工具输入参数
 */
export interface CalculatorInput {
    operation: OperationType;
    a: number;
    b: number;
}
/**
 * Calculator 工具成功返回结果
 */
export interface CalculatorSuccessResult {
    ok: true;
    operation: OperationType;
    operands: {
        a: number;
        b: number;
    };
    result: number;
}
/**
 * Calculator 工具错误返回结果
 */
export interface CalculatorErrorResult {
    ok: false;
    error: string;
}
/**
 * Calculator 工具返回结果（联合类型）
 */
export type CalculatorResult = CalculatorSuccessResult | CalculatorErrorResult;
/**
 * 运算符映射
 */
export declare const OPERATION_SYMBOLS: Record<OperationType, string>;
