"use strict";
/**
 * Delete subtasks tool definition
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
exports.deleteSubtasksTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 删除子任务工具定义
 */
exports.deleteSubtasksTool = (0, src_1.defineTool)({
    name: 'delete_subtasks',
    description: prompt_1.DESCRIPTION,
    params: {
        items: {
            type: 'array',
            description: '要删除的项目列表，每个项包含 project_id 和 subtask_id',
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
        // 执行删除操作（传递ctx以获取用户信息）
        return (0, executor_1.executeDeleteSubtasks)(args, ctx);
    },
});
// 附加提示信息
exports.deleteSubtasksTool.prompt = prompt_1.PROMPT;
// 导出类型和函数
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
