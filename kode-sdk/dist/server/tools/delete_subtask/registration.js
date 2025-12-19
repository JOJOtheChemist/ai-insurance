"use strict";
/**
 * Delete subtasks tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubtasksToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Delete subtasks 工具注册信息
 */
exports.deleteSubtasksToolRegistration = {
    metadata: {
        name: 'delete_subtasks',
        category: types_1.ToolCategory.PROJECT,
        description: '删除子任务（支持批量删除）',
        version: '1.0.0',
    },
    tool: index_1.deleteSubtasksTool,
};
