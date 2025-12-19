"use strict";
/**
 * Create timetable tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimetableToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Create timetable 工具注册信息
 */
exports.createTimetableToolRegistration = {
    metadata: {
        name: 'create_timetable',
        category: types_1.ToolCategory.SCHEDULE,
        description: '批量创建时间表/日程安排',
        version: '1.0.0',
    },
    tool: index_1.createTimetableTool,
};
