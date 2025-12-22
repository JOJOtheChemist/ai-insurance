import type { CustomerProfile } from '../components/CustomerInfoCards';

const API_HOST = (import.meta.env.VITE_CRM_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_BASE = API_HOST ? `${API_HOST}/api/v1` : '/api/v1';

/**
 * 根据会话ID获取客户信息
 */
export const getClientBySession = async (sessionId: string): Promise<CustomerProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/clients/session/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取客户信息失败: ${response.status}`);
        }

        const data = await response.json();
        return data.client;
    } catch (error) {
        console.error('❌ [Client API] 获取客户信息失败:', error);
        return null;
    }
};

/**
 * 根据客户ID获取客户详情
 */
export const getClientDetail = async (clientId: string | number): Promise<CustomerProfile | null> => {
    try {
        const response = await fetch(`${API_BASE}/clients/${clientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取客户详情失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ [Client API] 获取客户详情失败:', error);
        return null;
    }
};
