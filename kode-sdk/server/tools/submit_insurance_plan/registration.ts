import { ToolCategory, ToolRegistration } from '../types';
import { SubmitInsurancePlan } from './index';

export const submitInsurancePlanToolRegistration: ToolRegistration = {
    metadata: {
        name: 'submit_insurance_plan',
        description: '提交为客户推荐的结构化保险方案 (Scheme)',
        category: ToolCategory.DATABASE,
    },
    tool: SubmitInsurancePlan,
};
