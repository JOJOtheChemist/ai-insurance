"use strict";
/**
 * Calculator tool validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOperation = validateOperation;
exports.validateInput = validateInput;
/**
 * 验证运算类型是否有效
 */
function validateOperation(operation) {
    return ['add', 'subtract', 'multiply', 'divide'].includes(operation);
}
/**
 * 验证输入参数
 */
function validateInput(args) {
    // 验证运算类型
    if (!validateOperation(args.operation)) {
        return {
            valid: false,
            error: `不支持的运算类型: ${args.operation}。支持的类型: add, subtract, multiply, divide`,
        };
    }
    // 验证数字类型
    if (typeof args.a !== 'number' || isNaN(args.a)) {
        return {
            valid: false,
            error: `参数 a 必须是有效的数字，当前值: ${args.a}`,
        };
    }
    if (typeof args.b !== 'number' || isNaN(args.b)) {
        return {
            valid: false,
            error: `参数 b 必须是有效的数字，当前值: ${args.b}`,
        };
    }
    // 验证除法的除数不为 0
    if (args.operation === 'divide' && args.b === 0) {
        return {
            valid: false,
            error: '除数不能为 0',
        };
    }
    return { valid: true };
}
