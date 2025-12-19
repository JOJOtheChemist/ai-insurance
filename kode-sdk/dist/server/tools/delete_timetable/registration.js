"use strict";
/**
 * Delete timetable tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimetableToolRegistration = void 0;
const index_1 = require("./index");
const types_1 = require("../types");
/**
 * Delete timetable 工具注册信息
 */
exports.deleteTimetableToolRegistration = {
    tool: index_1.deleteTimetableTool,
    metadata: {
        name: 'delete_timetable',
        category: types_1.ToolCategory.SCHEDULE,
        description: '批量删除时间表记录。支持通过日期和时间段定位要删除的记录',
        version: '1.0.0',
        author: 'AI Time System',
    },
};
