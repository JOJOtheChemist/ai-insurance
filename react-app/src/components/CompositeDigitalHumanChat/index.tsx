import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

import { InputArea } from '../DigitalHumanChat/InputArea';
import { type CustomerProfile } from '../CustomerInfoCards';
import ClientSelector from '../ClientSelector';
import { AIMessageContent, type ToolCall } from './AIMessageContent';
import type { ClientListItem } from '../../services/clientApi';
import {
    CompactHeader,
    AvatarStage,
    WelcomeView,
    ChatView,
    CustomerDrawer,
    HistoryDrawer
} from '../CompositeChat';
import { useClientSSE } from '../../hooks/useClientSSE';
import { getClientBySession } from '../../services/clientApi';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
    toolCalls?: ToolCall[];
}

interface CompositeDigitalHumanChatProps {
    initialMessage?: string;
    onMessageConsumed?: () => void;
}

const CompositeDigitalHumanChat: React.FC<CompositeDigitalHumanChatProps> = ({ initialMessage, onMessageConsumed }) => {
    // Stage: 0 = Initial, 1 = Chat Started, 2 = Efficiency (Full Screen)
    const [stage, setStage] = useState<0 | 1 | 2>(0);
    const { token, user } = useAuth();

    // State
    const [isCustomerMounted, setIsCustomerMounted] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientListItem | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    // Track the last client ID for which we sent the context preamble
    // const lastContextClientIdRef = useRef<number | null>(null);

    // 🔥 优先从 URL Hash 或 sessionStorage 获取 SessionId，保证刷新后不丢失上下文
    const getInitialSessionId = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) return hash;

        const stored = sessionStorage.getItem('insure_chat_session_id');
        if (stored) return stored;

        const newId = 'session-' + Date.now();
        sessionStorage.setItem('insure_chat_session_id', newId);
        return newId;
    };

    const sessionIdRef = useRef<string>(getInitialSessionId());

    // 🔥 开启新会话逻辑
    const handleNewChat = useCallback(() => {
        console.log('✨ [Chat] 开启新会话...');
        // 🔥 先清除 hash 再清除 sessionStorage，防止 getInitialSessionId 读取到旧的 hash
        window.location.hash = '';
        sessionStorage.removeItem('insure_chat_session_id');
        window.location.reload();
    }, []);

    // 🔥 加载客户数据（初始加载和SSE更新后调用）
    const loadClientData = useCallback(async () => {
        if (!sessionIdRef.current) return;

        console.log('🔄 [CRM] 正在请求数据, SessionID:', sessionIdRef.current);
        const clientData = await getClientBySession(sessionIdRef.current);
        if (clientData) {
            console.log('📊 [CRM] 数据加载成功:', clientData);
            setCustomerProfile(clientData);
            setIsCustomerMounted(true);
        } else {
            console.warn('⚠️ [CRM] 未找到该 Session 关联的客户数据');
        }
    }, []);

    // 🔥 初始加载客户数据
    useEffect(() => {
        loadClientData();
    }, [loadClientData]);

    // 🔥 建立SSE连接，监听客户信息更新
    useClientSSE(sessionIdRef.current, loadClientData);

    // 🔥 Load chat history on mount
    useEffect(() => {
        const loadChatHistory = async () => {
            if (!sessionIdRef.current || !token) return;

            try {
                const API_HOST = (import.meta.env.VITE_CHAT_API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
                const sessionUrl = `${API_HOST}/api/sessions/${sessionIdRef.current}`;

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
                        console.log(`📜 [History] 加载成功: ${historyMessages.length} 条消息`);

                        // Convert backend message format to frontend format
                        const formattedMessages: Message[] = historyMessages.map((msg: any) => ({
                            role: msg.role === 'assistant' ? 'ai' : msg.role as 'user' | 'ai',
                            content: msg.role === 'assistant'
                                ? renderMessageContent(msg.content, msg.toolCalls || [])
                                : msg.content,
                            toolCalls: msg.toolCalls
                        }));

                        setMessages(formattedMessages);

                        // If there are messages, transition to chat stage
                        if (formattedMessages.length > 0) {
                            setStage(1);
                        }
                    }
                } else {
                    console.log('📜 [History] 未找到历史记录或会话不存在');
                }
            } catch (error) {
                console.error('📜 [History] 加载失败:', error);
            }
        };

        loadChatHistory();
    }, [token]); // Only run once on mount

    // Auto-scroll logic
    useEffect(() => {
        if (stage === 2 && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, stage]);

    // Stage transition logic
    useEffect(() => {
        const checkOverflow = () => {
            if (stage === 1 && chatContainerRef.current) {
                const { scrollHeight, clientHeight } = chatContainerRef.current;
                if (scrollHeight > clientHeight) {
                    setStage(2);
                }
            }
        };

        const timer = setTimeout(checkOverflow, 100);
        return () => clearTimeout(timer);
    }, [messages, stage]);

    // 🔥 自动触发首轮对话（如果有 initialMessage）
    // 使用 sessionStorage 持久化标记，防止组件重新挂载时重复发送
    useEffect(() => {
        // 生成唯一的消息标识（基于 sessionId + 消息内容的hash）
        const messageKey = `initial_msg_sent_${sessionIdRef.current}`;
        const alreadySent = sessionStorage.getItem(messageKey);

        if (initialMessage && !alreadySent && stage === 0) {
            console.log('🚀 [Chat] 自动触发首轮对话:', initialMessage);
            // 🔥 立即标记，防止 React StrictMode 双重触发
            sessionStorage.setItem(messageKey, 'true');
            setTimeout(() => {
                handleStartChat(initialMessage);
                // 🔥 消息已发送，通知父组件清除
                if (onMessageConsumed) {
                    onMessageConsumed();
                }
            }, 100);
        }
    }, [initialMessage, stage, onMessageConsumed]);

    // Message interface must be updated to support toolCalls
    // We can't change the interface definition here easily without full file replacement or careful targeting.
    // So we will target the interface definition block first if possible, but here we are targeting the render function and SSE loop.
    // Wait, I need to update the Interface first.

    // Let's assume I will do a separate edit for the Interface.
    // Here I will implement the logic assuming the interface is updated.

    // Render message content with customer profile detection and JSON parsing
    const renderMessageContent = (text: string, toolCalls: ToolCall[] = []) => {
        return (
            <AIMessageContent
                content={text}
                onSend={handleStartChat}
                toolCalls={toolCalls}
                onUpdateProfile={(profileUpdates) => {
                    // 处理客户档案更新状态同步
                    setCustomerProfile(prev => {
                        const base = prev || {} as CustomerProfile;
                        // 辅助函数：只有在有实际内容且不是“待确认”时合并
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
    };

    const handleStartChat = async (msg: string) => {
        if (!msg.trim()) return;

        if (stage === 0) {
            setStage(1);
        }

        const newMessages = [...messages, { role: 'user', content: msg }] as Message[];
        setMessages(newMessages);

        // Add initial AI placeholder
        setMessages(prev => [...prev, { role: 'ai', content: renderMessageContent(''), toolCalls: [] }]);

        let fullResponseText = '';
        // Track tool calls for the current message
        let currentToolCalls: ToolCall[] = [];

        try {
            // 🔥 API URL Configuration
            const API_HOST = (import.meta.env.VITE_CHAT_API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
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
                    sessionId: sessionIdRef.current,
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
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'ai') {
                        return [
                            ...prev.slice(0, -1),
                            {
                                ...last,
                                content: renderMessageContent(text, tools),
                                toolCalls: tools // Persist in state object too
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

                                // data structure depends on backend. Assuming: { name, input, output, ... }
                                // Or { tool_call_id, type: 'pool_use' ... }
                                // Let's try to handle a few variations robustly.

                                const toolId = data.tool_call_id || data.id || `tool-${Date.now()}-${Math.random()}`;

                                // Check if we already track this tool
                                const existingIndex = currentToolCalls.findIndex(t => t.id === toolId || t.name === data.name); // Simple dedupe by name if ID missing

                                const newToolCall: ToolCall = {
                                    id: toolId,
                                    name: data.name || 'Unknown Tool',
                                    status: 'success', // Default to success if we receive it as an event (usually means it finished)
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
                        { ...last, content: renderMessageContent(`[Connection Error: ${e.message}]`, currentToolCalls) }
                    ];
                }
                return prev;
            });
        }
    };

    const openClientSelector = () => setIsSelectorOpen(true);
    const handleSelectClient = async (client: ClientListItem) => {
        // 🔥 切换客户时，强制创建新会话，防止上下文混淆
        const newSessionId = 'session-' + Date.now();
        console.log(`🔄 [Chat] 切换客户 [${client.name}] -> 创建新会话: ${newSessionId}`);

        sessionStorage.setItem('insure_chat_session_id', newSessionId);
        window.history.replaceState(null, '', `#${newSessionId}`);
        sessionIdRef.current = newSessionId;

        // 重置聊天状态
        setMessages([]);

        setSelectedClient(client);
        setIsCustomerMounted(true);
        setIsSelectorOpen(false);

        console.log('✅ 已选择客户:', client);

        // 🔥 加载完整的客户档案数据
        try {
            const { getClientDetail } = await import('../../services/clientApi');
            const fullClientData = await getClientDetail(client.id);
            if (fullClientData) {
                console.log('📊 客户完整数据加载成功:', fullClientData);
                setCustomerProfile(fullClientData);
                // 自动打开客户档案抽屉
                setIsDrawerOpen(true);
            }
        } catch (error) {
            console.error('❌ 加载客户详情失败:', error);
        }
    };
    const handleSelectSession = useCallback((sessionId: string) => {
        console.log(`🔄 [Chat] 切换会话 -> ${sessionId}`);
        // 🔥 设置新的 session ID 并刷新页面加载历史消息
        sessionStorage.setItem('insure_chat_session_id', sessionId);
        window.location.hash = sessionId; // 不需要 # 前缀，replace 会自动处理
        window.location.reload();
    }, []);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const toggleHistoryDrawer = () => setIsHistoryDrawerOpen(!isHistoryDrawerOpen);

    const getChatSheetClasses = () => {
        if (stage === 2) return 'top-[60px] h-[calc(100%-60px)] rounded-none';
        if (stage === 1) return 'top-[180px] h-[calc(100%-180px)] rounded-t-[24px]';
        return 'top-[45%] h-[55%] rounded-t-[32px]';
    };

    return (
        <div className="h-full w-full relative bg-[#F5F5F7] overflow-hidden font-sans">
            {/* Compact Header (Stage 2) */}
            <CompactHeader
                stage={stage}
                customerProfile={customerProfile}
                onDrawerToggle={toggleDrawer}
                onHistoryDrawerToggle={toggleHistoryDrawer}
                onNewChat={handleNewChat}
            />

            {/* Avatar Stage (Stage 0 & 1) */}
            <AvatarStage
                stage={stage}
                isCustomerMounted={isCustomerMounted}
                customerProfile={selectedClient || customerProfile}
                onHistoryDrawerToggle={toggleHistoryDrawer}
                onCustomerMount={openClientSelector}
                onCustomerCardClick={toggleDrawer}
            />

            {/* Chat Sheet Container */}
            <div
                className={`flex flex-col absolute left-0 w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) z-20 ${getChatSheetClasses()}`}
            >
                {/* Handle (Start only) */}
                <div className={`w-full flex justify-center pt-3 pb-1 shrink-0 ${stage === 2 ? 'hidden' : ''}`}>
                    <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                </div>

                {/* Welcome View (Stage 0) */}
                <WelcomeView
                    stage={stage}
                    isCustomerMounted={isCustomerMounted}
                    customerProfile={customerProfile}
                    onPromptClick={handleStartChat}
                />

                {/* Chat View (Stage 1 & 2) */}
                <ChatView
                    stage={stage}
                    messages={messages}
                    chatContainerRef={chatContainerRef}
                    messagesEndRef={messagesEndRef}
                />
            </div>

            {/* Input Area */}
            <InputArea onSend={handleStartChat} />

            {/* Customer Drawer */}
            <CustomerDrawer
                isOpen={isDrawerOpen}
                onClose={toggleDrawer}
                customerProfile={customerProfile}
                onRefresh={loadClientData}
            />

            {/* History Drawer */}
            <HistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={toggleHistoryDrawer}
                customerProfile={customerProfile}
                onNewChat={handleNewChat}
                onSelectSession={handleSelectSession}
            />

            {/* Combined Overlay */}
            {(isDrawerOpen || isHistoryDrawerOpen) && (
                <div
                    onClick={() => { setIsDrawerOpen(false); setIsHistoryDrawerOpen(false); }}
                    className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity"
                ></div>
            )}

            {/* 客户选择器 */}
            <ClientSelector
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelectClient={handleSelectClient}
                salespersonId={1}
            />
        </div>
    );
};

export default CompositeDigitalHumanChat;
