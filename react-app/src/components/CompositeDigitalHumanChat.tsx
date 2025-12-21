import React, { useState, useEffect, useRef } from 'react';
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
    const sessionIdRef = useRef('session-' + Date.now());

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
            if (json.customer_profile && json.customer_profile.name) {
                const profile: CustomerProfile = json.customer_profile;
                setCustomerProfile(profile);
                setIsCustomerMounted(true);

                return (
                    <div className="space-y-3">
                        <CustomerProfileCards data={profile} />

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
                                            {JSON.stringify(profile, null, 2)}
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
                {text || '解析中...'}
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

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.delta) {
                                fullResponseText += data.delta;
                                updateBubble(fullResponseText);
                            }
                        } catch (e) {
                            // Ignore parse errors
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
            />

            {/* History Drawer */}
            <HistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={toggleHistoryDrawer}
                customerProfile={customerProfile}
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
