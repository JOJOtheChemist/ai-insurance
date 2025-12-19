"use strict";
/**
 * Batch Edit Tool Template - Registration
 *
 * 批量编辑工具的注册信息模板
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchEditToolTemplateRegistration = exports.batchEditToolTemplate = void 0;
const types_1 = require("../types");
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const executor_1 = require("./executor");
/**
 * 批量编辑工具定义（模板）
 *
 * 注意：这是一个模板，需要根据具体业务修改：
 * 1. 修改工具名称和描述
 * 2. 修改类型定义（types.ts）
 * 3. 实现业务逻辑（executor.ts 中的 applyOperation、validateOperation 等）
 */
exports.batchEditToolTemplate = (0, src_1.defineTool)({
    name: 'batch_edit_template', // TODO: 修改工具名称
    description: prompt_1.DESCRIPTION,
    params: {
        edits: {
            type: 'array',
            description: 'List of edit operations',
            required: true,
            items: {
                type: 'object',
                properties: {
                    path: {
                        type: 'string',
                        description: 'File path or resource identifier',
                        required: true,
                    },
                    operation: {
                        type: 'string',
                        enum: ['create', 'update', 'delete'],
                        description: 'Operation type',
                        required: true,
                    },
                    data: {
                        type: 'object',
                        description: 'Operation data',
                        required: true,
                    },
                },
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
        return (0, executor_1.executeBatchEdit)(args, ctx);
    },
});
// 附加提示信息
exports.batchEditToolTemplate.prompt = prompt_1.PROMPT;
/**
 * 工具注册信息（模板）
 *
 * TODO: 修改元数据以匹配你的工具
 */
exports.batchEditToolTemplateRegistration = {
    metadata: {
        name: 'batch_edit_template', // TODO: 修改工具名称
        category: types_1.ToolCategory.UTILITY, // TODO: 修改分类
        description: 'Batch edit operations with preview and backup', // TODO: 修改描述
        version: '1.0.0',
    },
    tool: exports.batchEditToolTemplate,
};
