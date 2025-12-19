"use strict";
/**
 * Delete schedule tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScheduleToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Delete schedule 工具注册信息
 */
exports.deleteScheduleToolRegistration = {
    metadata: {
        name: 'delete_schedule',
        category: types_1.ToolCategory.SCHEDULE,
        description: '删除日程记录',
        version: '1.0.0',
    },
    tool: index_1.deleteScheduleTool,
};
