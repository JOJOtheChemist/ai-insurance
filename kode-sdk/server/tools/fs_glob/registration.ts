import { fs_globTool } from './index';
import { ToolCategory } from '../types';
import type { ToolRegistration } from '../types';

export const fs_globToolRegistration: ToolRegistration = {
    metadata: {
        name: 'fs_glob',
        category: ToolCategory.FILE,
        description: '使用 glob 模式搜索文件',
        version: '1.0.0',
        tags: ['file', 'search', 'glob'],
    },
    tool: fs_globTool,
};
