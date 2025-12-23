import { useState, useCallback } from 'react';
import { type CustomerProfile } from '../../CustomerInfoCards';
import type { ClientListItem } from '../../../services/clientApi';
import { getClientBySession } from '../../../services/clientApi';
import { useClientSSE } from '../../../hooks/useClientSSE';

/**
 * Hook for managing client/customer data
 * Handles client loading, selection, and SSE updates
 */
export const useClientManagement = (sessionId: string) => {
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
    const [selectedClient, setSelectedClient] = useState<ClientListItem | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isCustomerMounted, setIsCustomerMounted] = useState(false);

    // 🔥 加载客户数据（初始加载和SSE更新后调用）
    const loadClientData = useCallback(async () => {
        if (!sessionId) return;

        console.log('🔄 [CRM] 正在请求数据, SessionID:', sessionId);
        const clientData = await getClientBySession(sessionId);
        if (clientData) {
            console.log('📊 [CRM] 数据加载成功:', clientData);
            setCustomerProfile(clientData);
            setIsCustomerMounted(true);
        } else {
            console.warn('⚠️ [CRM] 未找到该 Session 关联的客户数据');
        }
    }, [sessionId]);

    // 🔥 建立SSE连接，监听客户信息更新
    useClientSSE(sessionId, loadClientData);

    const openClientSelector = useCallback(() => {
        setIsSelectorOpen(true);
    }, []);

    const handleSelectClient = useCallback(async (
        client: ClientListItem,
        onSessionChange: (newSessionId: string) => void,
        onMessagesReset: () => void
    ) => {
        // 🔥 切换客户时，强制创建新会话，防止上下文混淆
        const newSessionId = 'session-' + Date.now();
        console.log(`🔄 [Chat] 切换客户 [${client.name}] -> 创建新会话: ${newSessionId}`);

        localStorage.setItem('insure_chat_session_id', newSessionId);
        window.history.replaceState(null, '', `#${newSessionId}`);

        // Notify parent to update session ref
        onSessionChange(newSessionId);

        // 重置聊天状态
        onMessagesReset();

        setSelectedClient(client);
        setIsCustomerMounted(true);
        setIsSelectorOpen(false);

        console.log('✅ 已选择客户:', client);

        // 🔥 加载完整的客户档案数据
        try {
            const { getClientDetail } = await import('../../../services/clientApi');
            const fullClientData = await getClientDetail(client.id);
            if (fullClientData) {
                console.log('📊 客户完整数据加载成功:', fullClientData);
                setCustomerProfile(fullClientData);
            }
        } catch (error) {
            console.error('❌ 加载客户详情失败:', error);
        }
    }, []);

    return {
        customerProfile,
        setCustomerProfile,
        selectedClient,
        isSelectorOpen,
        setIsSelectorOpen,
        isCustomerMounted,
        setIsCustomerMounted,
        loadClientData,
        openClientSelector,
        handleSelectClient
    };
};
