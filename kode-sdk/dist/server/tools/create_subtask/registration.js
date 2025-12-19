"use strict";
/**
 * Create subtask tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubtaskToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Create subtask 工具注册信息
 */
exports.createSubtaskToolRegistration = {
    metadata: {
        name: 'create_subtask',
        category: types_1.ToolCategory.PROJECT,
        description: '创建新的子任务',
        version: '1.0.0',
    },
    tool: index_1.createSubtaskTool,
};
