"use strict";
/**
 * Create subtask tool definition
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
exports.createSubtaskTool = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const validator_1 = require("./validator");
const executor_1 = require("./executor");
/**
 * 创建子任务工具定义
 */
exports.createSubtaskTool = (0, src_1.defineTool)({
    name: 'create_subtask',
    description: prompt_1.DESCRIPTION,
    params: {
        project: {
            type: 'string', // 接受字符串或数字，在运行时处理
            description: '所属项目（可以是项目ID或项目名称）- 如果是名称且项目不存在会自动创建',
            required: true,
        },
        category: {
            type: 'string',
            description: '项目分类（必填）：必须是"学习"、"生活"、"工作"或"娱乐"之一',
            required: true,
        },
        name: {
            type: 'string',
            description: '子任务名称（必填）',
            required: true,
        },
        priority: {
            type: 'string',
            description: '优先级（可选）',
            required: false,
        },
        urgency_importance: {
            type: 'string',
            description: '紧急重要程度（可选）',
            required: false,
        },
        difficulty: {
            type: 'string',
            description: '难度级别（可选）',
            required: false,
        },
        color: {
            type: 'string',
            description: '颜色标识（可选）',
            required: false,
        },
    },
    attributes: { readonly: false },
    async exec(args, ctx) {
        // 验证输入
        const validation = (0, validator_1.validateInput)(args);
        if (!validation.valid) {
            return { ok: false, error: validation.error };
        }
        // 执行创建操作（传递ctx以获取用户信息）
        return (0, executor_1.executeCreateSubtask)(args, ctx);
    },
});
// 附加提示信息
exports.createSubtaskTool.prompt = prompt_1.PROMPT;
// 导出类型和函数
__exportStar(require("./types"), exports);
__exportStar(require("./validator"), exports);
__exportStar(require("./executor"), exports);
__exportStar(require("./prompt"), exports);
