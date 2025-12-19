"use strict";
/**
 * Search notes tool definition
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
exports.searchNotesTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 搜索备注工具定义
 */
exports.searchNotesTool = (0, src_1.defineTool)({
    name: 'search_notes',
    description: prompt_1.DESCRIPTION,
    params: {
        query: {
            type: 'string',
            description: '搜索关键词（必填），1-100个字符',
        },
        project_id: {
            type: 'number',
            description: '项目ID筛选（可选），匹配 planned_project_id 或 actual_project_id',
        },
        subtask_id: {
            type: 'number',
            description: '子任务ID筛选（可选），匹配 planned_subtask_id 或 actual_subtask_id',
        },
        mood: {
            type: 'string',
            description: '心情筛选（可选）：happy, focused, tired, stressed, excited, neutral, anxious, relaxed',
        },
        start_date: {
            type: 'string',
            description: '开始日期（可选），格式：YYYY-MM-DD',
        },
        end_date: {
            type: 'string',
            description: '结束日期（可选），格式：YYYY-MM-DD',
        },
        limit: {
            type: 'number',
            description: '返回结果数量（可选），默认 20，最大 100',
        },
    },
    attributes: { readonly: true },
    async exec(args, ctx) {
        // 验证输入
        const validation = (0, validator_1.validateInput)(args);
        if (!validation.valid) {
            return { ok: false, error: validation.error };
        }
        // 执行搜索操作（传递ctx以获取用户信息）
        return (0, executor_1.executeSearchNotes)(args, ctx);
    },
});
// 附加提示信息
exports.searchNotesTool.prompt = prompt_1.PROMPT;
// 导出类型和函数
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
