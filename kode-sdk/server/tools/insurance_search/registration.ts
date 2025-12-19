import { ToolCategory, ToolRegistration } from '../types';
import { InsuranceSearch } from './index';

export const insuranceSearchToolRegistration: ToolRegistration = {
    metadata: {
        name: 'insurance_search',
        description: '通过关键词搜索保险产品（支持语义和条款深度搜索）',
        category: ToolCategory.DATABASE,
    },
    tool: InsuranceSearch,
};
