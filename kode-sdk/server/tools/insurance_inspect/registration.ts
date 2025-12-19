import { ToolCategory, ToolRegistration } from '../types';
import { InsuranceInspect } from './index';

export const insuranceInspectToolRegistration: ToolRegistration = {
    metadata: {
        name: 'insurance_inspect',
        description: '查看特定产品的详细字段（支持 lazy loading 和结构化提取）',
        category: ToolCategory.DATABASE,
    },
    tool: InsuranceInspect,
};
