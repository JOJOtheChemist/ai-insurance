"use strict";
/**
 * Get projects tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Get projects 工具注册信息
 */
exports.getProjectsToolRegistration = {
    metadata: {
        name: 'get_projects',
        category: types_1.ToolCategory.PROJECT,
        description: '获取项目列表',
        version: '1.0.0',
    },
    tool: index_1.getProjectsTool,
};
