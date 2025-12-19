
import React, { useEffect, useRef } from 'react';
import { PromptCard } from './PromptCard';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
}

interface InteractionSheetProps {
    minimized?: boolean;
    messages?: Message[];
    onPromptClick?: (prompt: string) => void;
}

export const InteractionSheet: React.FC<InteractionSheetProps> = ({ minimized, messages = [], onPromptClick }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, minimized]);

    return (
        <div
            className={`interaction-sheet flex flex-col absolute w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-10 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)`}
            style={{
                top: minimized ? '130px' : '42vh',
                height: minimized ? 'calc(100vh - 130px)' : '60vh', // Adjust height logic
                borderRadius: minimized ? '24px 24px 0 0' : '32px 32px 0 0'
            }}
        >

            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
            </div>

            {/* Welcome View */}
            <div
                className={`px-6 flex flex-col h-full transition-all duration-300 ${minimized ? 'opacity-0 h-0 overflow-hidden hidden' : 'opacity-100'}`}
            >
                <div className="mb-6 mt-2">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">我是张伟 👋</h1>
                    <p className="text-sm text-gray-500">家族信托专家，已协助 <span className="text-orange-500 font-bold">1.2w</span> 家庭。</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-bold">我是企业主</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">我是高管</span>
                </div>

                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">猜你想问</p>

                <div className="flex-1 overflow-y-auto space-y-3 pb-24 no-scrollbar">
                    <div onClick={() => onPromptClick?.('企业债务隔离')}>
                        <PromptCard
                            icon="fa-solid fa-scale-balanced"
                            iconColorClass="bg-orange-50 text-orange-500"
                            title="企业债务隔离"
                            subtitle="&quot;公司破产会影响我的个人房产吗？&quot;"
                        />
                    </div>

                    <div onClick={() => onPromptClick?.('大额保单架构')}>
                        <PromptCard
                            icon="fa-solid fa-piggy-bank"
                            iconColorClass="bg-blue-50 text-blue-500"
                            title="大额保单架构"
                            subtitle="&quot;如何利用保险进行税务合规筹划？&quot;"
                        />
                    </div>

                    <div onClick={() => onPromptClick?.('子女婚前财产')}>
                        <PromptCard
                            icon="fa-solid fa-child-reaching"
                            iconColorClass="bg-purple-50 text-purple-500"
                            title="子女婚前财产"
                            subtitle="&quot;给孩子买的房怎么防止被分割？&quot;"
                        />
                    </div>
                </div>
            </div>

            {/* Chat View */}
            <div
                ref={chatContainerRef}
                className={`flex-1 overflow-y-auto px-4 pt-2 space-y-4 pb-24 transition-opacity duration-500 delay-100 ${minimized ? 'opacity-100 block' : 'opacity-0 hidden'}`}
            >
                <div className="text-center text-[10px] text-gray-400 my-2">对话已由 AI 加密保护</div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 animate-[fadeInUp_0.3s_ease-out]`}>
                        <div className={`w-8 h-8 rounded-full border border-white shrink-0 overflow-hidden flex items-center justify-center ${msg.role === 'ai' ? 'bg-blue-50 text-blue-600 text-xs font-bold' : 'bg-gray-200'}`}>
                            {msg.role === 'ai' ? 'AI' : <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" alt="User" />}
                        </div>
                        <div className={`px-4 py-2.5 text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-[#1F2937] text-white rounded-[20px_4px_20px_20px]' : 'bg-[#F3F4F6] text-[#1F2937] rounded-[4px_20px_20px_20px]'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
