import { ToolCategory, ToolRegistration } from '../types';
import { UpdateClientIntelligence } from './index';

export const updateClientIntelligenceToolRegistration: ToolRegistration = {
    metadata: {
        name: 'update_client_intelligence',
        description: '同步更新客户全景档案信息 (画像、家庭成员、跟进记录)',
        category: ToolCategory.DATABASE,
    },
    tool: UpdateClientIntelligence,
};
