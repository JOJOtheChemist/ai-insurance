import { fs_grepTool } from './index';
import { ToolCategory } from '../types';
import type { ToolRegistration } from '../types';

export const fs_grepToolRegistration: ToolRegistration = {
    metadata: {
        name: 'fs_grep',
        category: ToolCategory.FILE, // Reusing FILE category
        description: '搜索文件内容 (grep)',
        version: '1.0.0',
        tags: ['file', 'search', 'grep', 'regex'],
    },
    tool: fs_grepTool,
};
