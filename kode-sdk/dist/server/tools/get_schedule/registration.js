"use strict";
/**
 * Get schedule tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScheduleToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Get schedule 工具注册信息
 */
exports.getScheduleToolRegistration = {
    metadata: {
        name: 'get_schedule',
        category: types_1.ToolCategory.SCHEDULE,
        description: '获取指定日期的日程数据',
        version: '1.0.0',
    },
    tool: index_1.getScheduleTool,
};
