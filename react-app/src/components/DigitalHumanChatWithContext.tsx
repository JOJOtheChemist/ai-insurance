import React, { useState, useEffect, useRef } from 'react';
import { InputArea } from './DigitalHumanChat/InputArea';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
}

const DigitalHumanChatWithContext: React.FC = () => {
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [isCustomerMounted, setIsCustomerMounted] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isChatStarted]);

    const handleStartChat = (msg: string) => {
        if (!msg.trim()) return;

        setIsChatStarted(true);
        setMessages(prev => [...prev, { role: 'user', content: msg }]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: (
                    <>
                        <p className="font-bold text-gray-800 mb-1">收到，已根据王总的预算进行调整。</p>
                        通过组合<span className="text-orange-600 font-bold">消费型重疾</span>与<span className="text-orange-600 font-bold">百万医疗</span>，我们将总保费控制在了 7500元/年，同时保额提升至 300万...
                    </>
                )
            }]);
        }, 800);
    };

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const mountCustomer = () => setIsCustomerMounted(true);

    return (
        <div className="h-full w-full relative bg-[#F9FAFB] overflow-hidden font-sans">

            {/* 1. Avatar Stage */}
            <div
                id="avatar-stage"
                className={`w-full flex justify-center items-end overflow-hidden relative bg-[radial-gradient(circle_at_center,_#374151_0%,_#111827_100%)] transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) z-0 nav-safe-pt ${isChatStarted ? 'h-[210px]' : 'h-[50vh]'}`}
                style={{ paddingTop: '60px' }} // Manual padding for header space
            >
                {/* Top Controls */}
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-30 text-white/80">
                    <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center">
                        <i className="fa-solid fa-chevron-down"></i>
                    </button>
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold">张伟 AI · 在线</span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center">
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                </div>

                {/* Context Card Area */}
                <div className="absolute top-16 left-0 w-full px-4 z-30">
                    {/* Empty State */}
                    <div
                        onClick={mountCustomer}
                        className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/30 bg-white/5 border-dashed ${isCustomerMounted ? 'hidden' : 'flex'}`}
                    >
                        <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <span className="text-xs font-medium">挂载客户档案以开始</span>
                    </div>

                    {/* Active State (Glass Card) */}
                    <div
                        onClick={toggleDrawer}
                        className={`w-full h-16 rounded-2xl items-center justify-between px-3 pl-4 cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 ${isCustomerMounted ? 'flex' : 'hidden'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-base font-bold shadow-lg border border-white/20">
                                王
                            </div>
                            <div className="flex flex-col text-white">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">王志远</span>
                                    <span className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded backdrop-blur-md">HOT</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-white/70">
                                    <span>CTO</span>
                                    <span className="w-0.5 h-2 bg-white/30"></span>
                                    <span>预算8W</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                            <i className="fa-solid fa-address-card text-xs"></i>
                        </div>
                    </div>
                </div>

                {/* Avatar Image */}
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                    className={`rounded-full border-4 border-white/10 shadow-2xl z-10 transition-all duration-600 ease-out origin-bottom ${isChatStarted ? 'w-56 h-56 scale-60 translate-y-5 opacity-80' : 'w-56 h-56 mb-4'}`}
                    alt="Current Avatar"
                />

                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#111827] to-transparent z-0"></div>
            </div>

            {/* 2. Chat Sheet */}
            <div
                className={`flex flex-col absolute left-0 w-full bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 ${isChatStarted ? 'top-[200px] h-[calc(100vh-200px)] rounded-t-[24px]' : 'top-[48vh] h-[52vh]'}`}
            >
                {/* Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                </div>

                {/* Welcome View */}
                <div className={`px-6 flex flex-col h-full transition-all duration-500 overflow-hidden ${isChatStarted ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
                    <div className="mb-4 mt-2">
                        <h1 className="text-xl font-bold text-gray-900 mb-1">我是张伟 👋</h1>
                        <p className="text-sm text-gray-500">
                            {isCustomerMounted ? (
                                <>已为您准备好 <span className="font-bold text-orange-500">王志远</span> 的档案分析。</>
                            ) : (
                                "请先挂载客户档案以获取专属建议。"
                            )}
                        </p>
                    </div>

                    {isCustomerMounted && (
                        <>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">针对该客户的策略建议：</p>
                            <div className="space-y-3 overflow-y-auto no-scrollbar pb-10">
                                <button
                                    onClick={() => handleStartChat('生成降维打击方案')}
                                    className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-orange-50 hover:border-orange-200 transition-colors text-left"
                                >
                                    <div>
                                        <div className="text-sm font-bold text-gray-800 flex items-center">
                                            <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i>生成降维打击方案
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">"针对价格敏感，先做定期重疾+医疗..."</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleStartChat('模拟异议处理')}
                                    className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-orange-50 hover:border-orange-200 transition-colors text-left"
                                >
                                    <div>
                                        <div className="text-sm font-bold text-gray-800 flex items-center">
                                            <i className="fa-solid fa-microphone-lines text-blue-500 mr-2"></i>模拟异议处理
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">"演练如何回应他对查资产的抗拒..."</div>
                                    </div>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Chat View */}
                <div className={`px-4 flex-1 overflow-y-auto pt-2 space-y-4 pb-24 ${isChatStarted ? 'block animate-[fadeIn_0.5s_forwards]' : 'hidden'}`}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 animate-[fadeInUp_0.3s_ease-out]`}>
                            <div className={`w-8 h-8 rounded-full border border-white shrink-0 overflow-hidden flex items-center justify-center ${msg.role === 'ai' ? 'bg-blue-50 text-blue-600 text-xs font-bold' : 'bg-orange-100'}`}>
                                {msg.role === 'ai' ? 'AI' : <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" alt="User" />}
                            </div>
                            <div className={`px-4 py-2.5 text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-[#1F2937] text-white rounded-[20px_4px_20px_20px]' : 'bg-[#F3F4F6] text-[#1F2937] rounded-[4px_20px_20px_20px]'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <InputArea onSend={handleStartChat} />

            {/* CRM Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-[85%] max-w-md bg-white shadow-2xl z-[60] flex flex-col border-l border-gray-100 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-[#FFF9F5]">
                    <span className="text-sm font-bold text-gray-800">客户全景档案</span>
                    <button
                        onClick={toggleDrawer}
                        className="w-8 h-8 rounded-full bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="p-10 flex flex-col items-center justify-center h-full text-gray-400">
                    <i className="fa-solid fa-address-card text-4xl mb-4 text-orange-200"></i>
                    <p>这里显示王志远的详细 Bento Grid 档案</p>
                </div>
            </div>

            {/* Drawer Overlay */}
            {isDrawerOpen && (
                <div
                    onClick={toggleDrawer}
                    className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity"
                ></div>
            )}
        </div>
    );
};

export default DigitalHumanChatWithContext;
