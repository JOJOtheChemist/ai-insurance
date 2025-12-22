import { ToolCategory, ToolRegistration } from '../types';
import { GetCurrentClientProfile } from './index';

export const getClientProfileRegistration: ToolRegistration = {
    metadata: {
        name: 'get_client_profile',
        description: '获取客户全景档案信息。支持按名字搜索（传入 name）或获取当前会话关联客户（不传参）。',
        category: ToolCategory.DATABASE,
    },
    tool: GetCurrentClientProfile,
};
