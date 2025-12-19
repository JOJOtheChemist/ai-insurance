"use strict";
/**
 * Calculator tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatorToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Calculator 工具注册信息
 */
exports.calculatorToolRegistration = {
    metadata: {
        name: 'calculator',
        category: types_1.ToolCategory.MATH,
        description: '数学计算工具',
        version: '1.0.0',
    },
    tool: index_1.calculatorTool,
};
