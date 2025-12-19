"use strict";
/**
 * Batch Edit Timetable Tool Registration
 *
 * 批量编辑时间表工具的注册信息
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchEditTimetableToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
/**
 * Batch Edit Timetable 工具注册信息
 */
exports.batchEditTimetableToolRegistration = {
    metadata: {
        name: 'batch_edit_timetable',
        category: types_1.ToolCategory.SCHEDULE,
        description: '批量编辑时间表（创建/更新/删除），支持预览、备份和差异计算',
        version: '1.0.0',
        tags: ['schedule', 'batch', 'edit', 'preview', 'backup'],
    },
    tool: index_1.batchEditTimetableTool,
};
