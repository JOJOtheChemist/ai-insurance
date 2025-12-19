"use strict";
/**
 * Delete schedule tool definition
 * 批量删除时间段工具定义
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
exports.deleteScheduleTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 批量删除时间段工具定义
 * 直接调用后端批量删除API（不再使用MCP）
 */
exports.deleteScheduleTool = (0, src_1.defineTool)({
    name: 'delete_schedule',
    description: prompt_1.DESCRIPTION,
    params: {
        slot_ids: {
            type: 'array',
            description: '要删除的时间段ID列表（必需，数字数组）',
            required: true,
        },
    },
    attributes: { readonly: false },
    async exec(args, ctx) {
        // 验证输入
        const validation = (0, validator_1.validateInput)(args);
        if (!validation.valid) {
            return { ok: false, error: validation.error };
        }
        // 执行批量删除操作
        return (0, executor_1.executeDeleteSchedule)(args, ctx);
    },
});
// 附加提示信息
exports.deleteScheduleTool.prompt = prompt_1.PROMPT;
// 导出类型和函数
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
