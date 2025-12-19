"use strict";
/**
 * Get schedule tool registration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScheduleV2ToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Get schedule 工具注册信息
 */
exports.getScheduleV2ToolRegistration = {
    metadata: {
        name: 'get_schedule_v2',
        category: types_1.ToolCategory.SCHEDULE,
        description: '获取指定日期的v2合并日程数据（含统一备注）',
        version: '1.0.0',
    },
    tool: index_1.getScheduleV2Tool,
};
