import { useState, useEffect, useCallback, useRef, type Dispatch, type SetStateAction } from 'react';
import { AIMessageContent, type ToolCall } from '../AIMessageContent';
import type { Message, Stage } from '../types';
import type { CustomerProfile } from '../../CustomerInfoCards';
import { useChatHistory } from '../../../hooks/useChatHistory';

interface UseChatMessagesProps {
    sessionId: string;
    token: string | null;
    stage: Stage;
    setStage: (stage: Stage) => void;
    customerProfile: CustomerProfile | null;
    setCustomerProfile: Dispatch<SetStateAction<CustomerProfile | null>>;
    setIsCustomerMounted: Dispatch<SetStateAction<boolean>>;
    selectedClient: any;
    user: any;
}

/**
 * Hook for managing chat messages and SSE streaming
 * Handles message history, sending messages, and rendering
 */
export const useChatMessages = (props: UseChatMessagesProps) => {
    const {
        sessionId,
        token,
        stage,
        setStage,
        setCustomerProfile,
        setIsCustomerMounted,
        selectedClient,
        user
    } = props;
    const [messages, setMessages] = useState<Message[]>([]);

    // Use a ref to store the latest handleStartChat so renderMessageContent can access it
    const handleStartChatRef = useRef<((msg: string) => Promise<void>) | null>(null);

    // 🔥 Load chat history using custom hook
    console.log('🔍 [Initializing useChatHistory]:', {
        sessionId,
        hasToken: !!token,
        tokenLength: token?.length
    });
    const { messages: historyMessages, reload: reloadHistory } = useChatHistory(sessionId, token);

    // Render message content with customer profile detection and JSON parsing
    const renderMessageContent = useCallback((text: string) => {
        return (
            <AIMessageContent
                content={text}
                onSend={handleStartChatRef.current || (() => Promise.resolve())}
                onUpdateProfile={(profileUpdates) => {
                    // 处理客户档案更新状态同步
                    setCustomerProfile(prev => {
                        const base = prev || {} as CustomerProfile;
                        // 辅助函数：只有在有实际内容且不是"待确认"时合并
                        const safeMerge = (newVal: any, oldVal: any) => {
                            if (newVal === undefined || newVal === null || newVal === '待确认' || newVal === '') {
                                return oldVal;
                            }
                            return newVal;
                        };

                        return {
                            ...base,
                            name: safeMerge(profileUpdates.name, base.name),
                            role: safeMerge(profileUpdates.role, base.role),
                            age: safeMerge(profileUpdates.age, base.age),
                            annual_budget: safeMerge(profileUpdates.annual_budget, base.annual_budget),
                            annual_income: safeMerge(profileUpdates.annual_income, base.annual_income),
                            location: safeMerge(profileUpdates.location, base.location),
                            marital_status: safeMerge(profileUpdates.marital_status, base.marital_status),
                            risk_factors: profileUpdates.risk_factors?.length ? profileUpdates.risk_factors : (base.risk_factors || []),
                            needs: profileUpdates.needs?.length ? profileUpdates.needs : (base.needs || []),
                            resistances: profileUpdates.resistances?.length ? profileUpdates.resistances : (base.resistances || []),
                            family_structure: profileUpdates.family_structure?.length ? profileUpdates.family_structure : (base.family_structure || []),
                            follow_ups: profileUpdates.follow_ups?.length ? profileUpdates.follow_ups : (base.follow_ups || []),
                            contacts: profileUpdates.contacts?.length ? profileUpdates.contacts : (base.contacts || []),
                            proposed_plans: base.proposed_plans || []
                        };
                    });
                    setIsCustomerMounted(true);
                }}
            />
        );
    }, [setCustomerProfile, setIsCustomerMounted]);

    const handleStartChat = useCallback(async (msg: string) => {
        if (!msg.trim()) return;

        if (stage === 0) {
            setStage(1);
        }

        const newMessages = [...messages, { role: 'user', content: msg }] as Message[];
        setMessages(newMessages);

        // Add initial AI placeholder
        setMessages(prev => [...prev, { role: 'ai', content: renderMessageContent(''), toolCalls: [], hideBubble: true }]);

        let fullResponseText = '';
        // Track tool calls for the current message
        let currentToolCalls: ToolCall[] = [];

        try {
            // 🔥 API URL Configuration
            const API_HOST = (import.meta.env.VITE_CHAT_API_URL || '').replace(/\/$/, '');
            const chatUrl = `${API_HOST}/api/chat`;

            console.log('🚀 [Chat] Sending request to:', chatUrl);

            const response = await fetch(chatUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: msg,
                    agentId: 'insure-recommand-v3',
                    sessionId: sessionId,
                    userId: user?.username || 'guest',
                    // 🔥 如果已选择客户，传递客户ID和上下文信息给后端
                    ...(selectedClient?.id && {
                        clientId: selectedClient.id,
                        clientContext: {
                            name: selectedClient.name,
                            age: selectedClient.age,
                            role: selectedClient.role,
                            budget: selectedClient.annual_budget
                        }
                    })
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || response.statusText);
            }
            if (!response.body) throw new Error('No body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            // Update UI with latest text and tools
            const updateUI = (text: string, tools: ToolCall[]) => {
                const hideBubble = !text.trim();
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'ai') {
                        return [
                            ...prev.slice(0, -1),
                            {
                                ...last,
                                content: renderMessageContent(text),
                                toolCalls: tools, // Persist in state object too
                                hideBubble
                            }
                        ];
                    }
                    return prev;
                });
            };

            let currentEvent = 'message'; // Default event type

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim() === '') {
                        currentEvent = 'message';
                        continue;
                    }

                    if (line.startsWith('event: ')) {
                        currentEvent = line.slice(7).trim();
                        continue;
                    }

                    if (line.startsWith('data: ')) {
                        try {
                            const jsonStr = line.slice(6);
                            if (jsonStr === '[DONE]') continue; // Standard SSE finished

                            const data = JSON.parse(jsonStr);

                            // Handle Standard Message Delta (event: message OR event: text OR event: thinking)
                            if (currentEvent === 'message' || currentEvent === 'text' || currentEvent === 'thinking' || !currentEvent) {
                                if (data.delta) {
                                    fullResponseText += data.delta;
                                    updateUI(fullResponseText, currentToolCalls);
                                } else if (typeof data === 'string') {
                                    fullResponseText += data;
                                    updateUI(fullResponseText, currentToolCalls);
                                }
                            }

                            // Handle Tool Events
                            if (currentEvent === 'tool') {
                                console.log('🛠️ Tool Event Received:', data);

                                const toolId = data.tool_call_id || data.id || `tool-${Date.now()}-${Math.random()}`;

                                // Check if we already track this tool
                                const existingIndex = currentToolCalls.findIndex(t => t.id === toolId || t.name === data.name);

                                const newToolCall: ToolCall = {
                                    id: toolId,
                                    name: data.name || 'Unknown Tool',
                                    status: 'success', // Default to success if we receive it as an event
                                    args: data.input || data.args,
                                    result: data.output || data.result,
                                    timestamp: Date.now()
                                };

                                // Specialized logic: if we receive 'tool_use', mark running. If 'tool_result', mark success.
                                if (data.type === 'tool_use') {
                                    newToolCall.status = 'running';
                                    newToolCall.result = undefined;
                                } else if (data.type === 'tool_result') {
                                    newToolCall.status = 'success';
                                }

                                if (existingIndex >= 0) {
                                    // Update existing
                                    currentToolCalls[existingIndex] = { ...currentToolCalls[existingIndex], ...newToolCall };
                                } else {
                                    // Add new
                                    currentToolCalls.push(newToolCall);
                                }

                                updateUI(fullResponseText, currentToolCalls);

                                // 🔥 Trigger logic based on specific tool names if needed
                                if (data.name === 'update_client_intelligence') {
                                    console.log('ℹ️ Client Intelligence updated via tool');
                                }
                            }

                        } catch (e) {
                            console.warn('SSE Parse Error:', e);
                            if (currentEvent === 'message' || currentEvent === 'text' || !currentEvent) {
                                const rawContent = line.replace(/^data: /, '');
                                if (rawContent !== '[DONE]') {
                                    if (!rawContent.trim().startsWith('{')) {
                                        fullResponseText += rawContent + '\n';
                                        updateUI(fullResponseText, currentToolCalls);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (fullResponseText) {
                let pretty = fullResponseText;
                try {
                    pretty = JSON.stringify(JSON.parse(fullResponseText), null, 2);
                } catch {
                    // ignore
                }
                updateUI(pretty, currentToolCalls);
            }
        } catch (e: any) {
            console.error('Chat error:', e);
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last.role === 'ai') {
                    return [
                        ...prev.slice(0, -1),
                        { ...last, content: renderMessageContent(`[Connection Error: ${e.message}]`), hideBubble: false }
                    ];
                }
                return prev;
            });
        }
    }, [messages, stage, setStage, token, sessionId, selectedClient, user, renderMessageContent]);

    // Store the handleStartChat in ref so renderMessageContent can use it
    useEffect(() => {
        handleStartChatRef.current = handleStartChat;
    }, [handleStartChat]);

    // Sync history messages to local state when they change
    useEffect(() => {
        console.log('[History Effect] Triggered:', {
            historyMessagesLength: historyMessages?.length,
            currentMessagesLength: messages.length,
            currentStage: stage
        });

        if (historyMessages && historyMessages.length > 0) {
            console.log('[History Effect] Processing history messages...');
            const formattedMessages: Message[] = historyMessages.map((msg: any) => ({
                role: msg.role,
                content: msg.role === 'ai'
                    ? (msg.hideBubble ? '' : renderMessageContent(msg.content))
                    : msg.content,
                toolCalls: msg.toolCalls,
                hideBubble: msg.hideBubble
            }));

            console.log('[History Effect] Formatted messages:', formattedMessages.length);
            console.log('[History Effect] First message:', formattedMessages[0]);

            setMessages(formattedMessages);

            // If there are messages, transition directly to stage 2 (full screen efficiency mode)
            if (formattedMessages.length > 0) {
                console.log('[History Effect] Setting stage to 2 (full screen for history)');
                setStage(2);
            }
        } else {
            console.log('[History Effect] No history messages to process');
        }
    }, [historyMessages, renderMessageContent, setStage]);

    return {
        messages,
        setMessages,
        handleStartChat,
        renderMessageContent,
        reloadHistory
    };
};
