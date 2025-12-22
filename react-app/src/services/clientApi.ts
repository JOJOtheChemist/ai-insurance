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

/**
 * 获取客户列表
 */
export interface ClientListItem {
    id: number;
    name: string;
    role?: string;
    age?: number;
    annual_budget?: string;
    annual_income?: string;
    location?: string;
    marital_status?: string;
    update_time?: string;
    plans_count: number;
    family_members_count: number;
}

export interface ClientListResponse {
    total: number;
    clients: ClientListItem[];
}

export const getClientsList = async (
    salespersonId?: number,
    limit: number = 100,
    offset: number = 0
): Promise<ClientListResponse | null> => {
    try {
        const params = new URLSearchParams();
        if (salespersonId) params.append('salesperson_id', salespersonId.toString());
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        const response = await fetch(`${API_BASE}/clients/list?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取客户列表失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ [Client API] 获取客户列表失败:', error);
        return null;
    }
};


export interface SessionSummary {
    id: string;
    title: string;
    summary: string;
    time: string;
    full_time: string;
}

export interface ClientSessionGroup {
    client: {
        id: number;
        name: string;
        avatar_char: string;
        role?: string;
        status?: string;
        annual_budget?: string; // New field
    };
    sessions: SessionSummary[];
}

export interface HistoryResponse {
    groups: ClientSessionGroup[];
    unassigned: SessionSummary[];
}

export const getGroupedSessions = async (salespersonId: number = 1): Promise<HistoryResponse | null> => {
    try {
        const response = await fetch(`${API_BASE}/clients/sessions/history?salesperson_id=${salespersonId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取历史会话失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ [Client API] 获取历史会话失败:', error);
        return null;
    }
};
