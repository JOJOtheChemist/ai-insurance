"use strict";
/**
 * 搜索备注工具注册
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNotesToolRegistration = void 0;
const index_1 = require("./index");
const types_1 = require("../types");
/**
 * 搜索备注工具注册配置
 */
exports.searchNotesToolRegistration = {
    metadata: {
        name: 'search_notes',
        category: types_1.ToolCategory.DATABASE,
        description: '全文搜索时间表备注（planned_note 和 actual_note），支持按项目、心情、日期范围筛选',
        version: '1.0.0',
        author: 'AI Time System',
        tags: ['search', 'notes', 'database', 'fulltext'],
    },
    tool: index_1.searchNotesTool,
};
