import React, { useState, useEffect, useRef } from 'react';
import { InputArea } from './DigitalHumanChat/InputArea';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
}

const DigitalHumanChatScreenEfficiency: React.FC = () => {
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, isChatStarted]);

    const handleStartChat = (msg: string) => {
        if (!msg.trim()) return;

        setIsChatStarted(true);

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: msg }]);

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: (
                    <>
                        收到，针对<span className="font-bold">科技公司高管</span>人群，高端医疗险建议重点对比【昂贵医院直付】与【既往症承保】条款。正在生成对比表...
                    </>
                )
            }]);
        }, 500);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <div className="h-full w-full relative bg-white overflow-hidden font-sans">
            {/* 1. Immersive Layer */}
            <div
                id="immersive-layer"
                className={`absolute top-0 left-0 w-full h-[45vh] bg-[radial-gradient(circle_at_center,_#374151_0%,_#111827_100%)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-10 origin-top flex flex-col items-center justify-end pb-12 ${isChatStarted ? '-translate-y-full opacity-0 pointer-events-none' : ''}`}
            >
                <div className="absolute top-4 left-4 text-white/80"><i className="fa-solid fa-chevron-down"></i></div>
                <div className="absolute top-16 w-full px-6 z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 text-white shadow-xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-xl shadow-lg">
                            王
                        </div>
                        <div>
                            <div className="font-bold text-lg">
                                王志远
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded ml-1 border border-white/10">HOT</span>
                            </div>
                            <div className="text-xs opacity-80 mt-1">科技公司 CTO · 年预算 8W</div>
                        </div>
                    </div>
                </div>
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                    className="w-48 h-48 rounded-full border-4 border-white/10 shadow-2xl z-10 scale-110 translate-y-4"
                    alt="Avatar"
                />
            </div>

            {/* 2. Compact Header */}
            <div
                id="compact-header"
                className={`absolute left-0 w-full h-[60px] bg-white/98 backdrop-blur-md border-b border-gray-100 z-20 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-between px-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${isChatStarted ? 'top-0' : '-top-20'}`}
            >
                <div className="flex items-center gap-2 pl-1">
                    <div className="relative">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100"
                            alt="Avatar Small"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">张伟 AI</span>
                    </div>
                </div>

                <button
                    className="group bg-white border border-gray-200 rounded-full pl-[3px] pr-[10px] py-[3px] flex items-center gap-2 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] max-w-[160px] active:scale-98 active:bg-gray-50 hover:border-orange-200 hover:bg-orange-50"
                    onClick={toggleDrawer}
                >
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center text-xs font-bold shrink-0">
                        王
                    </div>
                    <div className="flex flex-col items-start justify-center pr-1 text-left">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-gray-900 leading-none">王志远</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium leading-none mt-1 truncate max-w-[80px]">
                            科技公司 CTO
                        </span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 ml-1 group-hover:text-orange-300 transition-colors"></i>
                </button>
            </div>

            {/* 3. Chat Container Wrapper */}
            <div
                id="chat-container-wrapper"
                className={`absolute left-0 w-full bg-white transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-15 flex flex-col ${isChatStarted ? 'top-[60px] h-[calc(100vh-60px)] rounded-none' : 'top-[42vh] h-[100vh] rounded-t-[32px]'}`}
            >
                {/* Welcome View */}
                <div className={`px-6 pt-8 transition-opacity duration-300 ${isChatStarted ? 'hidden opacity-0' : 'block opacity-100'}`}>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">下午好</h1>
                    <p className="text-sm text-gray-500 mb-6">正在为 <span className="font-bold text-orange-600">王志远 (CTO)</span> 定制方案。</p>
                    <button
                        onClick={() => handleStartChat('生成高端医疗对比')}
                        className="w-full bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-center justify-between group hover:bg-orange-100 mb-3 text-left transition-colors"
                    >
                        <span className="text-sm font-bold text-gray-800">生成高端医疗险对比</span>
                        <i className="fa-solid fa-wand-magic-sparkles text-orange-400"></i>
                    </button>
                </div>

                {/* Chat View */}
                <div
                    ref={containerRef}
                    className={`flex-1 overflow-y-auto px-4 pt-4 space-y-4 pb-24 ${isChatStarted ? 'block' : 'hidden'}`}
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 animate-[fadeInUp_0.3s_ease-out]`}>
                            <div className={`w-8 h-8 rounded-full border border-white shrink-0 overflow-hidden flex items-center justify-center ${msg.role === 'ai' ? 'bg-blue-50 text-blue-600 text-[10px] font-bold border-blue-100' : 'bg-gray-200'}`}>
                                {msg.role === 'ai' ? 'AI' : <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" alt="User" />}
                            </div>
                            <div className={`px-4 py-3 text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-[#1F2937] text-white rounded-[20px_4px_20px_20px]' : 'bg-[#F3F4F6] text-[#1F2937] rounded-[4px_20px_20px_20px]'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 w-full z-30">
                <InputArea onSend={handleStartChat} />
            </div>

            {/* CRM Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-[85%] max-w-md bg-white shadow-2xl z-[60] border-l border-gray-100 flex flex-col transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50">
                    <span className="font-bold text-gray-800">客户全景档案</span>
                    <button
                        onClick={toggleDrawer}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold">
                            王
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">王志远</h2>
                            <div className="flex gap-2 mt-1">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">CTO</span>
                                <span className="bg-orange-50 px-2 py-0.5 rounded text-xs text-orange-600">HOT</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">年预算</div>
                            <div className="font-bold">5-8万</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">家庭结构</div>
                            <div className="font-bold">已婚育</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-[55] backdrop-blur-sm transition-opacity"
                    onClick={toggleDrawer}
                ></div>
            )}
        </div>
    );
};

export default DigitalHumanChatScreenEfficiency;
