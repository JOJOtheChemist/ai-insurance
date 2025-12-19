import { fs_readTool } from './index';
import { ToolCategory } from '../types';
import type { ToolRegistration } from '../types';

export const fs_readToolRegistration: ToolRegistration = {
    metadata: {
        name: 'fs_read',
        category: ToolCategory.FILE,
        description: '读取文件内容',
        version: '1.0.0',
        tags: ['file', 'read', 'content'],
    },
    tool: fs_readTool,
};
