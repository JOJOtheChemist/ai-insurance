
import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { type ToolCall } from '../components/CompositeDigitalHumanChat/AIMessageContent';

export interface Message {
    role: 'user' | 'ai';
    content: string | ReactNode;
    toolCalls?: ToolCall[];
    hideBubble?: boolean;
}

export const useChatHistory = (sessionId: string | null, token: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Needed for message content rendering (if we want to keep render logic here or passed in)
    // For a pure data hook, we might return raw data, but the existing code mixes rendering.
    // To keep it clean, let's return RAW data structure if possible, or accept a transform function.
    // However, the original code had `renderMessageContent`. We should probably export the raw data 
    // and let the component handle the rendering transformation, OR pass the render function in.
    // Let's pass the transformer in, or just return the raw array and let the component map it.

    // Actually, looking at the component, `renderMessageContent` depends on `handleStartChat` and `setCustomerProfile`.
    // It's better to fetch the raw data here and return it, then let the component format it.

    // But wait, the component's state `messages` IS the formatted one. 
    // If I return raw backend messages, the component still needs to map them.
    // Let's return the raw backend messages and a `reload` function.

    const loadChatHistory = useCallback(async () => {
        if (!sessionId || !token) {
            console.warn(`[History] Skipping load: sessionId=${sessionId}, token=${!!token}`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const API_HOST = (import.meta.env.VITE_CHAT_API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
            const sessionUrl = `${API_HOST}/api/sessions/${sessionId}`;

            console.log('📜 [History] 加载历史消息:', sessionUrl);

            const response = await fetch(sessionUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.ok && data.session && data.session.messages) {
                    const historyMessages = data.session.messages;
                    console.log(`📜 [History] 加载成功: ${historyMessages.length} 条消息`, historyMessages);

                    // We'll return the raw messages, but with roles normalized if needed.
                    // The component's `formattedMessages` logic was:
                    // role: msg.role === 'assistant' ? 'ai' : msg.role
                    // content: msg.role === 'assistant' ? render(...) : msg.content

                    // To make this hook useful, we should probably return a standardized structure
                    // that the component can easily map.
                    const normalized = historyMessages.map((msg: any) => {
                        const role = msg.role === 'assistant' ? 'ai' : msg.role;
                        const content = msg.content;
                        const hideBubble = role === 'ai' && (typeof content !== 'string' || !content.trim());

                        return {
                            role,
                            content,
                            hideBubble,
                            toolCalls: msg.toolCalls?.map((tc: any) => ({
                                ...tc,
                                status: tc.status === 'error' ? 'failed' : tc.status
                            }))
                        };
                    });

                    console.log('📜 [History] Normalized first message:', normalized[0]);
                    setMessages(normalized);
                } else {
                    console.log('📜 [History] 未找到历史记录或会话不存在');
                    setMessages([]);
                }
            } else {
                console.log('📜 [History] 未找到历史记录或会话不存在 (Response not ok)');
                setError('Failed to load history');
            }
        } catch (err: any) {
            console.error('📜 [History] 加载失败:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [sessionId, token]);

    useEffect(() => {
        loadChatHistory();
    }, [loadChatHistory]);

    return { messages, loading, error, reload: loadChatHistory, setMessages };
};
