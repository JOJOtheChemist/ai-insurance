"use strict";
/**
 * Batch Edit Timetable Tool Definition
 *
 * 批量编辑时间表工具定义
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
exports.batchEditTimetableTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const executor_1 = require("./executor");
/**
 * 批量编辑时间表工具定义
 */
exports.batchEditTimetableTool = (0, src_1.defineTool)({
    name: 'batch_edit_timetable',
    description: prompt_1.DESCRIPTION,
    params: {
        edits: {
            type: 'array',
            description: 'List of timetable edit operations (create/update/delete)',
            required: true,
            items: {
                type: 'object',
                properties: {
                    operation: {
                        type: 'string',
                        enum: ['create', 'update', 'delete'],
                        description: 'Operation type',
                    },
                    data: {
                        type: 'object',
                        description: 'Time slot data (id required for update/delete)',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'Time slot ID (required for update/delete)',
                            },
                            date: {
                                type: 'string',
                                description: 'Date in YYYY-MM-DD format',
                            },
                            time_block: {
                                type: 'number',
                                description: 'Time block (0-47)',
                            },
                            planned_project_id: { type: 'number' },
                            planned_subtask_id: { type: 'number' },
                            planned_note: { type: 'string' },
                            actual_project_id: { type: 'number' },
                            actual_subtask_id: { type: 'number' },
                            actual_note: { type: 'string' },
                            mood: { type: 'string' },
                        },
                    },
                },
                required: ['operation', 'data'],
            },
        },
        preview: {
            type: 'boolean',
            description: 'Preview mode: calculate diff without executing',
            required: false,
        },
        approvedIndices: {
            type: 'array',
            description: 'Indices of approved operations (for preview mode)',
            required: false,
            items: {
                type: 'number',
            },
        },
    },
    attributes: { readonly: false },
    async exec(args, ctx) {
        return (0, executor_1.executeBatchEditTimetable)(args, ctx);
    },
});
// 附加提示信息
exports.batchEditTimetableTool.prompt = prompt_1.PROMPT;
// 导出类型和函数
__exportStar(require("./types"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
