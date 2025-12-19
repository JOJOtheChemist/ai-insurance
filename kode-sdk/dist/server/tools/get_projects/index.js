"use strict";
/**
 * Get projects tool definition
 *
 * 从主后端 API 获取项目列表
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
exports.getProjectsTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 获取项目列表工具定义
 */
exports.getProjectsTool = (0, src_1.defineTool)({
    name: 'get_projects',
    description: prompt_1.DESCRIPTION,
    params: {},
    attributes: { readonly: true },
    async exec(args, ctx) {
        // 验证输入（虽然不需要参数，但保持一致性）
        const validation = (0, validator_1.validateInput)(args);
        if (!validation.valid) {
            return { ok: false, error: validation.error };
        }
        // 执行获取操作（传递ctx以获取用户信息）
        return (0, executor_1.executeGetProjects)(args, ctx);
    },
});
// 附加提示信息
exports.getProjectsTool.prompt = prompt_1.PROMPT;
// 导出类型和函数
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
// export * from './format-converter'; // 注释掉以避免重复导出 CategoryStats 和 ProjectsSummary
