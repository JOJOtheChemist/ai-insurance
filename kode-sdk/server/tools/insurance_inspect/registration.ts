import { ToolCategory, ToolRegistration } from '../types';
import { InsuranceInspect } from './index';

export const insuranceInspectToolRegistration: ToolRegistration = {
    metadata: {
        name: 'insurance_inspect',
        description: '查看特定【商业保险产品】的条款与详情（严禁用于查客户档案）',
        category: ToolCategory.DATABASE,
    },
    tool: InsuranceInspect,
};
