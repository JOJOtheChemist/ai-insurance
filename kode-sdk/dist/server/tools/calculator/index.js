"use strict";
/**
 * Calculator tool definition
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatorTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 计算器工具定义
 */
exports.calculatorTool = (0, src_1.defineTool)({
    name: 'calculator',
    description: prompt_1.DESCRIPTION,
    params: {
        operation: {
            type: 'string',
            enum: ['add', 'subtract', 'multiply', 'divide'],
            description: '运算类型: add(加), subtract(减), multiply(乘), divide(除)',
        },
        a: { type: 'number', description: '第一个数字' },
        b: { type: 'number', description: '第二个数字' },
    },
    attributes: { readonly: true, noEffect: true },
    async exec(args) {
        // 验证输入
        const validation = (0, validator_1.validateInput)(args);
        if (!validation.valid) {
            return { ok: false, error: validation.error };
        }
        // 执行计算
        return (0, executor_1.executeCalculation)(args);
    },
});
// 附加提示信息
exports.calculatorTool.prompt = prompt_1.PROMPT;
// 导出类型
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
