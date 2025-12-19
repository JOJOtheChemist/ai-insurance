
import React, { useState, useEffect } from 'react';

const AIRoleIntro: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);

    const triggerAction = (text: string) => {
        // 1. User message
        const newUserMsg = {
            id: Date.now(),
            type: 'user',
            content: text,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wang"
        };

        setMessages(prev => [...prev, newUserMsg]);

        // 2. AI typing simulation
        setTimeout(() => {
            const newAiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                content: "好的，已经为您准备好相关工具。我们可以先从客户的家庭结构开始梳理...",
            };
            setMessages(prev => [...prev, newAiMsg]);

            // Scroll to bottom simulation (in a real app, use a ref)
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 600);
    };

    // Auto scroll when messages change
    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);


    return (
        <div className="h-screen w-full flex flex-col overflow-hidden text-[#5C4B41] bg-[#FFF9F5] font-['Noto_Sans_SC']">
            {/* Header */}
            <header className="h-14 bg-white/90 backdrop-blur-md border-b border-orange-500/5 flex items-center justify-between px-5 fixed top-0 w-full z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8850] to-[#FF5520] flex items-center justify-center text-white shadow-orange-200 shadow-md">
                        <i className="fa-solid fa-robot text-xs"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-800 tracking-wide">Jarvis <span className="text-orange-400">Pro</span></span>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-400 hover:text-orange-500">
                    <i className="fa-solid fa-gear"></i>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 pt-20 pb-40 space-y-6 scroll-smooth" id="chat-container">

                <div id="welcome-dashboard" className="flex flex-col gap-6 pt-4 pb-2">

                    <div className="text-center px-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-3 text-2xl border border-[#FFE4D6]">
                            👋
                        </div>
                        <h1 className="text-xl font-bold text-[#5C4B41] mb-1">下午好，金牌销售</h1>
                        <p className="text-xs text-[#9A897D]">我是您的 AI 助理，准备好搞定今天的客户了吗？</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => triggerAction('帮我分析一下这个客户的潜在风险点')}
                            className="bg-white p-4 border border-[#FFE4D6] shadow-[0_4px_20px_rgba(255,107,53,0.08)] flex flex-col items-start gap-3 h-32 group rounded-[24px] transition-all  active:scale-95">
                            <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#FF6B35] flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                                <i className="fa-solid fa-magnifying-glass-chart"></i>
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-bold text-gray-800">客户诊断</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">上传画像，分析缺口</p>
                            </div>
                        </button>

                        <button onClick={() => triggerAction('我要进行一场针对【价格敏感型客户】的模拟演练')}
                            className="bg-[#FDFBF7] p-4 border border-[#EAE0D5] flex flex-col items-start gap-3 h-32 group rounded-[24px] transition-all  active:scale-95">
                            <div className="w-8 h-8 rounded-full bg-white text-[#8C7364] border border-[#EAE0D5] flex items-center justify-center group-hover:bg-[#8C7364] group-hover:text-white transition-colors">
                                <i className="fa-solid fa-microphone-lines"></i>
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-bold text-[#5C4B41]">模拟演练</h3>
                                <p className="text-[10px] text-[#9A897D] mt-0.5">针对性话术对练</p>
                            </div>
                        </button>

                        <button onClick={() => triggerAction('打开保费计算器')}
                            className="bg-white p-3 border border-gray-100 flex items-center gap-3 h-16 rounded-[24px] transition-all active:scale-95">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-calculator"></i>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xs font-bold text-gray-700">保费试算</h3>
                            </div>
                        </button>

                        <button onClick={() => triggerAction('查找最近的重疾险理赔案例')}
                            className="bg-white p-3 border border-gray-100 flex items-center gap-3 h-16 rounded-[24px] transition-all active:scale-95">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-book-open"></i>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xs font-bold text-gray-700">找案例</h3>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="h-px bg-[#EAE0D5] flex-1"></div>
                        <span className="text-[10px] text-[#9A897D]">或直接开始对话</span>
                        <div className="h-px bg-[#EAE0D5] flex-1"></div>
                    </div>
                </div>

                {/* Message Flow */}
                <div id="message-flow" className="flex flex-col gap-6">
                    {messages.map((msg) => (
                        msg.type === 'user' ? (
                            <div key={msg.id} className="flex flex-row-reverse gap-3 items-start animate-fade-in-up">
                                <img src={msg.avatar} className="w-8 h-8 rounded-full bg-orange-50 mt-1" />
                                <div className="bg-[#2D2D2D] text-white p-3 shadow-sm text-sm rounded-tr-sm rounded-tl-3xl rounded-bl-3xl rounded-br-3xl">
                                    {msg.content}
                                </div>
                            </div>
                        ) : (
                            <div key={msg.id} className="flex gap-3 items-start animate-fade-in-up">
                                <div className="w-8 h-8 rounded-full bg-[#FFF0E6] flex-shrink-0 flex items-center justify-center text-orange-600 text-[10px] font-bold mt-1">AI</div>
                                <div className="bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-sm text-gray-700 leading-relaxed rounded-tl-sm rounded-tr-3xl rounded-br-3xl rounded-bl-3xl border border-[#FFF0E6]">
                                    {msg.content}
                                </div>
                            </div>
                        )
                    ))}
                </div>

            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#FFF0E6] px-4 py-3 z-30 pb-6">
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-[#F5F5F5] text-gray-400 flex items-center justify-center hover:text-orange-500 transition-colors">
                        <i className="fa-solid fa-circle-plus text-lg"></i>
                    </button>
                    <div className="flex-1 bg-[#FAFAFA] rounded-full flex items-center px-4 h-11 border border-[#EEEEEE] focus-within:border-[#FFDCC2] focus-within:bg-white transition-all">
                        <input type="text" placeholder="输入指令..."
                            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400" />
                        <button className="text-gray-300 hover:text-orange-500"><i className="fa-solid fa-microphone"></i></button>
                    </div>
                    <button className="w-11 h-11 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-orange-200 active:scale-90 transition-transform">
                        <i className="fa-solid fa-paper-plane text-sm"></i>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AIRoleIntro;
