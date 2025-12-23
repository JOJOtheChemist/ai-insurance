import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

import { InputArea } from './DigitalHumanChat/InputArea';
import { type CustomerProfile } from './CustomerInfoCards';
import ClientSelector from './ClientSelector';
import type { ClientListItem } from '../services/clientApi';
import {
    CompactHeader,
    AvatarStage,
    WelcomeView,
    ChatView,
    CustomerDrawer,
    HistoryDrawer
} from './CompositeChat';
import { AIMessageContent } from './CompositeDigitalHumanChat/AIMessageContent';
import { useClientSSE } from '../hooks/useClientSSE';
import { getClientBySession } from '../services/clientApi';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
    toolCalls?: any[];
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
        sessionStorage.removeItem('insure_chat_session_id');
        window.location.hash = '';
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

    // Render message content with AIMessageContent component
    const renderMessageContent = (text: string, _toolCalls?: any[]) => {
        // Even if no text, if there are tool calls, we want to render the bubble
        // Note: toolCalls are handled by MessageBubble, not internal to AIMessageContent

        return (
            <AIMessageContent
                content={text || ''}
                onSend={handleStartChat}
                onUpdateProfile={(profile) => {
                    if (profile) {
                        setCustomerProfile(prev => ({ ...prev, ...profile } as CustomerProfile));
                        setIsCustomerMounted(true);
                    }
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

        setMessages(prev => [...prev, { role: 'ai', content: renderMessageContent(''), toolCalls: [] }]);

        let fullResponseText = '';
        let currentToolCalls: any[] = [];

        try {
            const response = await fetch('/api/chat', {
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

            const updateBubble = (text: string, toolCalls?: any[]) => {
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'ai') {
                        return [
                            ...prev.slice(0, -1),
                            {
                                ...last,
                                content: renderMessageContent(text, toolCalls || last.toolCalls),
                                toolCalls: toolCalls || last.toolCalls
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
                        // Empty line resets event type usually, but here we just reset for safety
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
                            // 🔥 后端通过 thinking 事件发送AI回复（从 think_chunk 转换而来）
                            if (currentEvent === 'message' || currentEvent === 'text' || currentEvent === 'thinking' || !currentEvent) {
                                if (data.delta) {
                                    fullResponseText += data.delta;
                                    updateBubble(fullResponseText);
                                } else if (typeof data === 'string') {
                                    // Fallback if data is raw string
                                    fullResponseText += data;
                                    updateBubble(fullResponseText);
                                }
                            }

                            // Handle Tool Events (Real-time and Final)
                            if (currentEvent === 'tool' || currentEvent === 'tool_start' || currentEvent === 'tool_end' || currentEvent === 'tool_call') {
                                console.log(`🛠️ Tool Event [${currentEvent}]:`, data);

                                const toolId = data.id || (data.name + (data.index || ''));
                                const rawState = (data.state || data.status || '').toLowerCase();
                                const toolCall = {
                                    id: toolId,
                                    name: data.name,
                                    status: (currentEvent === 'tool_start' ? 'running' :
                                        (rawState === 'failed' ? 'failed' : 'success')) as 'running' | 'success' | 'failed',
                                    args: data.args || data.input,
                                    result: data.result || data.output,
                                    timestamp: Date.now()
                                };

                                // Find existing tool call or add new one
                                const existingIdx = currentToolCalls.findIndex(t => t.id === toolCall.id || t.name === toolCall.name);

                                if (existingIdx > -1) {
                                    // Merge if existing found
                                    currentToolCalls[existingIdx] = {
                                        ...currentToolCalls[existingIdx],
                                        ...toolCall,
                                        // Preserve args if we only got result in tool_end
                                        args: toolCall.args || currentToolCalls[existingIdx].args
                                    };
                                } else {
                                    currentToolCalls.push(toolCall);
                                }

                                updateBubble(fullResponseText, [...currentToolCalls]);

                                // Side effects for specific tools
                                if (data.name === 'update_client_intelligence' && (data.status === 'success' || data.state === 'success')) {
                                    console.log('ℹ️ Client Intelligence工具已成功执行，触发数据刷新...');
                                    setTimeout(loadClientData, 500);
                                }
                            }

                        } catch (e) {
                            console.warn('SSE Parse Error:', e);
                            // 🔥 Fallback: If JSON parse fails, try to show raw line content if it looks like text
                            // This helps show "Thinking..." or raw output if the backend is misbehaving
                            if (currentEvent === 'message' || currentEvent === 'text' || !currentEvent) {
                                // If line starts with "data: ", strip it and show the rest
                                const rawContent = line.replace(/^data: /, '');
                                if (rawContent !== '[DONE]') {
                                    // console.log('⚠️ Using Raw Content Fallback:', rawContent);
                                    // Only append if it's NOT a tool JSON blob
                                    if (!rawContent.trim().startsWith('{')) {
                                        fullResponseText += rawContent + '\n';
                                        updateBubble(fullResponseText);
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
                updateBubble(pretty);
            }
        } catch (e: any) {
            console.error('Chat error:', e);
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last.role === 'ai') {
                    return [
                        ...prev.slice(0, -1),
                        { ...last, content: renderMessageContent(`[Connection Error: ${e.message}]`) }
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
            const { getClientDetail } = await import('../services/clientApi');
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
        sessionStorage.setItem('insure_chat_session_id', sessionId);
        window.location.hash = `#${sessionId}`;
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
        <div className="h-full w-full relative bg-[#FFFBF9] overflow-hidden font-sans">
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
                className={`flex flex-col absolute left-0 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) z-20 ${getChatSheetClasses()}`}
                style={{
                    backgroundColor: '#FFF9F6',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #FFEDD5 1.5px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}
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
