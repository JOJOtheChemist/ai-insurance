"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_grepToolRegistration = void 0;
const index_1 = require("./index");
const types_1 = require("../types");
exports.fs_grepToolRegistration = {
    metadata: {
        name: 'fs_grep',
        category: types_1.ToolCategory.FILE, // Reusing FILE category
        description: '搜索文件内容 (grep)',
        version: '1.0.0',
        tags: ['file', 'search', 'grep', 'regex'],
    },
    tool: index_1.fs_grepTool,
};
