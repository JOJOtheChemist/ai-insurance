import { ToolCategory, ToolRegistration } from '../types';
import { InsuranceFilter } from './index';

export const insuranceFilterToolRegistration: ToolRegistration = {
    metadata: {
        name: 'insurance_filter',
        description: '根据年龄、险种类型精确筛选保险产品',
        category: ToolCategory.DATABASE, // Categorizing as Database since it queries product DB
    },
    tool: InsuranceFilter,
};
