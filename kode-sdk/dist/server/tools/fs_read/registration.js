"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_readToolRegistration = void 0;
const index_1 = require("./index");
const types_1 = require("../types");
exports.fs_readToolRegistration = {
    metadata: {
        name: 'fs_read',
        category: types_1.ToolCategory.FILE,
        description: '读取文件内容',
        version: '1.0.0',
        tags: ['file', 'read', 'content'],
    },
    tool: index_1.fs_readTool,
};
