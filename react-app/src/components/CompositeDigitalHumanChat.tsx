import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

import { InputArea } from './DigitalHumanChat/InputArea';
import { CustomerProfileCards, type CustomerProfile } from './CustomerInfoCards';
import {
    CompactHeader,
    AvatarStage,
    WelcomeView,
    ChatView,
    CustomerDrawer,
    HistoryDrawer
} from './CompositeChat';
import { useClientSSE } from '../hooks/useClientSSE';
import { getClientBySession } from '../services/clientApi';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
}

const CompositeDigitalHumanChat: React.FC = () => {
    // Stage: 0 = Initial, 1 = Chat Started, 2 = Efficiency (Full Screen)
    const [stage, setStage] = useState<0 | 1 | 2>(0);
    const { token, user } = useAuth();

    // State
    const [isCustomerMounted, setIsCustomerMounted] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

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
        window.location.reload(); // 简单粗暴但有效：刷新页面彻底重置所有状态
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

    // Render message content with customer profile detection
    const renderMessageContent = (text: string) => {
        try {
            const json = JSON.parse(text);
            // 允许没有 name，只要我们当前已经有了 Profile (说明是增量更新)
            if (json.customer_profile) {
                const profileUpdates = json.customer_profile;

                setCustomerProfile(prev => {
                    const base = prev || {} as CustomerProfile;

                    // 辅助函数：只有在有实际内容且不是“待确认”时合并
                    const safeMerge = (newVal: any, oldVal: any) => {
                        if (newVal === undefined || newVal === null || newVal === '待确认' || newVal === '') {
                            return oldVal;
                        }
                        return newVal;
                    };

                    // 增量合并逻辑
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

                        // 特别注意：proposed_plans 只通过后端拉取(SSE触发)，不被 AI 的 JSON 覆盖
                        proposed_plans: base.proposed_plans || []
                    };
                });

                setIsCustomerMounted(true);

                return (
                    <div className="space-y-3">
                        {/* 这里传入合并后的预览（由于状态更新是异步的，这里直接构造一个预览对象） */}
                        <CustomerProfileCards data={json.customer_profile} />

                        <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-circle-check text-green-500 mt-0.5"></i>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-green-700 mb-1">✅ 已更新客户信息为：</p>
                                    <details className="text-xs">
                                        <summary className="text-green-600 cursor-pointer hover:text-green-700 font-medium">
                                            点击查看提取的JSON数据
                                        </summary>
                                        <pre className="mt-2 p-2 bg-white rounded border border-green-100 text-[11px] overflow-x-auto">
                                            {JSON.stringify(profileUpdates, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            </div>
                        </div>

                        {json.thought && (
                            <details className="mt-3">
                                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">查看分析过程</summary>
                                <p className="text-xs text-gray-500 mt-2 pl-2 border-l-2 border-gray-200">{json.thought}</p>
                            </details>
                        )}
                    </div>
                );
            }
        } catch (e) {
            // Not valid JSON, display as-is
        }

        return (
            <pre className="whitespace-pre-wrap text-[13px] leading-relaxed font-mono text-gray-900 break-words">
                {text}
            </pre>
        );
    };

    const handleStartChat = async (msg: string) => {
        if (!msg.trim()) return;

        if (stage === 0) {
            setStage(1);
        }

        const newMessages = [...messages, { role: 'user', content: msg }] as Message[];
        setMessages(newMessages);

        setMessages(prev => [...prev, { role: 'ai', content: renderMessageContent('') }]);

        let fullResponseText = '';

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
                    userId: user?.username || 'guest'
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

            const updateBubble = (text: string) => {
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'ai') {
                        return [
                            ...prev.slice(0, -1),
                            { ...last, content: renderMessageContent(text) }
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

                            // Handle Tool Events
                            if (currentEvent === 'tool') {
                                console.log('🛠️ Tool Event Received:', data); // Log full tool data for debugging

                                // 🔥 工具事件现在只用于日志，实际更新通过SSE的client_updated事件触发
                                // SSE会在后端完成数据库更新后推送，保证数据一致性
                                if (data.name === 'update_client_intelligence') {
                                    console.log('ℹ️ Client Intelligence工具已调用，等待SSE更新通知...');
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

    const mountCustomer = () => setIsCustomerMounted(true);
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const toggleHistoryDrawer = () => setIsHistoryDrawerOpen(!isHistoryDrawerOpen);

    const getChatSheetClasses = () => {
        if (stage === 2) return 'top-[60px] h-[calc(100%-60px)] rounded-none';
        if (stage === 1) return 'top-[180px] h-[calc(100%-180px)] rounded-t-[24px]';
        return 'top-[45%] h-[55%] rounded-t-[32px]';
    };

    return (
        <div className="h-full w-full relative bg-[#F9FAFB] overflow-hidden font-sans">
            {/* Compact Header (Stage 2) */}
            <CompactHeader
                stage={stage}
                customerProfile={customerProfile}
                onDrawerToggle={toggleDrawer}
                onNewChat={handleNewChat}
            />

            {/* Avatar Stage (Stage 0 & 1) */}
            <AvatarStage
                stage={stage}
                isCustomerMounted={isCustomerMounted}
                customerProfile={customerProfile}
                onHistoryDrawerToggle={toggleHistoryDrawer}
                onCustomerMount={mountCustomer}
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
            />

            {/* Combined Overlay */}
            {(isDrawerOpen || isHistoryDrawerOpen) && (
                <div
                    onClick={() => { setIsDrawerOpen(false); setIsHistoryDrawerOpen(false); }}
                    className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity"
                ></div>
            )}
        </div>
    );
};

export default CompositeDigitalHumanChat;
