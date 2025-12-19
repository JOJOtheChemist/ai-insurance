"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_globToolRegistration = void 0;
const index_1 = require("./index");
const types_1 = require("../types");
exports.fs_globToolRegistration = {
    metadata: {
        name: 'fs_glob',
        category: types_1.ToolCategory.FILE,
        description: '使用 glob 模式搜索文件',
        version: '1.0.0',
        tags: ['file', 'search', 'glob'],
    },
    tool: index_1.fs_globTool,
};
