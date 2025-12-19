"use strict";
/**
 * Calculator tool execution logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCalculation = executeCalculation;
const types_1 = require("./types");
/**
 * 执行数学运算
 */
async function executeCalculation(args) {
    console.log(`[工具] calculator(${args.operation}, ${args.a}, ${args.b})`);
    // 模拟延迟
    await new Promise(r => setTimeout(r, 500));
    let result;
    // 执行运算
    switch (args.operation) {
        case 'add':
            result = args.a + args.b;
            break;
        case 'subtract':
            result = args.a - args.b;
            break;
        case 'multiply':
            result = args.a * args.b;
            break;
        case 'divide':
            if (args.b === 0) {
                return { ok: false, error: '除数不能为0' };
            }
            result = args.a / args.b;
            break;
        default:
            return { ok: false, error: `不支持的运算: ${args.operation}` };
    }
    // 获取运算符号
    const symbol = types_1.OPERATION_SYMBOLS[args.operation];
    console.log(`[工具返回] ${args.operation}: ${args.a} ${symbol} ${args.b} = ${result}`);
    return {
        ok: true,
        operation: args.operation,
        operands: { a: args.a, b: args.b },
        result,
    };
}
