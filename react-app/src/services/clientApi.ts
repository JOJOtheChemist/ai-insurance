import type { CustomerProfile } from '../components/CustomerInfoCards';

const API_BASE = '/api/v1';

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
