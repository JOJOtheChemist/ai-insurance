import { useRef, useCallback } from 'react';

/**
 * Hook for managing chat session IDs
 * Handles session creation, persistence, and switching
 */
export const useSessionManagement = () => {
    // 🔥 优先从 URL Hash 或 localStorage 获取 SessionId，保证刷新后不丢失上下文
    const getInitialSessionId = () => {
        let id = window.location.hash.replace('#', '');

        // 如果 Hash 中有 ID，优先使用，并同步到 localStorage
        if (id) {
            localStorage.setItem('insure_chat_session_id', id);
            return id;
        }

        // 如果 Hash 没有，尝试从 localStorage 获取
        const stored = localStorage.getItem('insure_chat_session_id');
        if (stored) {
            id = stored;
            // 同步回 URL Hash (Silent update)
            window.history.replaceState(null, '', `#${id}`);
            return id;
        }

        // 都没有，创建新的并保存
        const newId = 'session-' + Date.now();
        localStorage.setItem('insure_chat_session_id', newId);
        window.history.replaceState(null, '', `#${newId}`);
        return newId;
    };

    const sessionIdRef = useRef<string>(getInitialSessionId());

    // 🔥 开启新会话逻辑
    const handleNewChat = useCallback(() => {
        console.log('✨ [Chat] 开启新会话...');
        // 🔥 先清除 hash 再清除 localStorage，防止 getInitialSessionId 读取到旧的 hash
        window.location.hash = '';
        localStorage.removeItem('insure_chat_session_id');
        window.location.reload();
    }, []);

    // 🔥 选择会话逻辑
    const handleSelectSession = useCallback((sessionId: string) => {
        console.log(`🔄 [Chat] 切换会话 -> ${sessionId}`);
        // 🔥 设置新的 session ID 并刷新页面加载历史消息
        localStorage.setItem('insure_chat_session_id', sessionId);
        window.location.hash = sessionId;
        window.location.reload();
    }, []);

    return {
        sessionId: sessionIdRef.current,
        sessionIdRef,
        handleNewChat,
        handleSelectSession
    };
};
