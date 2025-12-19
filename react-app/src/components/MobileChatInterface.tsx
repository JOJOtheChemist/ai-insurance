
import React from 'react';

const MobileChatInterface: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col overflow-hidden text-[#5C4B41] bg-[#FFF9F5] font-['Noto_Sans_SC']">

            {/* Header */}
            <header className="h-14 bg-white/90 backdrop-blur-md border-b border-[#FFF0E6] flex items-center justify-between px-5 fixed top-0 w-full z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8850] to-[#FF5520] flex items-center justify-center text-white shadow-orange-200 shadow-md">
                        <i className="fa-solid fa-robot text-xs"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-800 tracking-wide">Jarvis <span className="text-orange-400">Pro</span></span>
                </div>

                <button className="flex items-center gap-2 bg-white border border-[#FFE4D6] pl-1 pr-3 py-1 rounded-full shadow-sm active:scale-95 transition-transform">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-6 h-6 rounded-full bg-orange-50" />
                    <span className="text-xs font-bold text-gray-700">王志远</span>
                </button>
            </header>

            {/* Main Area */}
            <main className="flex-1 overflow-y-auto px-4 pt-20 pb-40 space-y-8" id="chat-container">

                <div className="flex justify-center">
                    <span className="text-[10px] text-[#9A897D] font-medium tracking-widest opacity-60">14:32</span>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-start max-w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-[#FFF0E6] flex-shrink-0 flex items-center justify-center text-orange-600 text-[10px] font-bold mt-1">
                            AI
                        </div>
                        <div className="bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-sm text-gray-700 leading-relaxed rounded-tl-sm rounded-tr-3xl rounded-br-3xl rounded-bl-3xl border border-[#FFF0E6]">
                            为了测算准确，请确认王总的年收入区间？
                        </div>
                    </div>

                    <div className="pl-11 w-full overflow-x-auto no-scrollbar flex gap-2 pr-4">
                        <button className="flex-shrink-0 px-4 py-2 bg-white border border-[#FFDCC2] text-[#FF6B35] rounded-full text-xs font-bold shadow-sm active:bg-[#FF6B35] active:text-white transition-colors">
                            30-50万
                        </button>
                        <button className="flex-shrink-0 px-4 py-2 bg-[#FFF0E6] border border-[#FF8850] text-[#D94F1A] rounded-full text-xs font-bold shadow-sm ring-2 ring-[#FFF0E6]">
                            50-80万
                        </button>
                        <button className="flex-shrink-0 px-4 py-2 bg-white border border-[#FFDCC2] text-[#FF6B35] rounded-full text-xs font-bold shadow-sm active:bg-[#FF6B35] active:text-white transition-colors">
                            100万+
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-start max-w-[95%]">
                        <div className="w-8 h-8 rounded-full bg-[#FFF0E6] flex-shrink-0 flex items-center justify-center text-orange-600 text-[10px] font-bold mt-1">
                            AI
                        </div>

                        <div className="bg-white border border-[#FFE4D6] shadow-[0_12px_30px_-10px_rgba(255,107,53,0.1)] rounded-[24px] w-full p-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF8850] via-[#FFDCC2] to-white"></div>

                            <div className="flex justify-between items-center mb-3">
                                <span className="inline-flex items-center gap-1.5 bg-[#FFF0E6] text-[#D94F1A] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide">
                                    <i className="fa-solid fa-bullseye"></i> 隐私切入策略
                                </span>
                                <div className="flex gap-2">
                                    <button className="text-gray-300 hover:text-orange-500"><i className="fa-solid fa-arrows-rotate text-xs"></i></button>
                                </div>
                            </div>

                            <p className="text-[13px] text-[#5C4B41] leading-relaxed font-medium">
                                “王总，这款产品是完全独立的健康账户，不需要关联家庭资产。就像您在瑞士银行的保险箱，<span className="bg-[#FFF0E6] text-[#D94F1A] px-1 rounded mx-0.5">隐私级别最高</span>，完全不影响您的其他财务规划。”
                            </p>

                            <div className="mt-4 pt-3 border-t border-[#FFF0E6] flex gap-2">
                                <button className="flex-1 py-2 bg-gradient-to-r from-[#FF8850] to-[#FF6B35] text-white text-xs font-bold rounded-full shadow-md shadow-orange-100 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                                    <i className="fa-regular fa-copy"></i> 复制话术
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pl-11 w-full overflow-x-auto no-scrollbar flex gap-2 pr-4">
                        <button className="flex-shrink-0 bg-[#FDFBF7] border border-dashed border-[#D4C5B9] text-[#8C7364] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform">
                            <i className="fa-solid fa-share-nodes opacity-70"></i> 发送绿通案例
                        </button>
                        <button className="flex-shrink-0 bg-[#FDFBF7] border border-dashed border-[#D4C5B9] text-[#8C7364] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform">
                            <i className="fa-regular fa-file-pdf opacity-70"></i> 生成条款对比
                        </button>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#FFF0E6] px-4 py-3 z-30 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">

                <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pl-1">
                    <button className="text-[11px] bg-[#F5F5F5] text-gray-500 px-3 py-1.5 rounded-full font-medium whitespace-nowrap hover:bg-[#FFF0E6] hover:text-orange-600 transition-colors">📅 预约沟通</button>
                    <button className="text-[11px] bg-[#F5F5F5] text-gray-500 px-3 py-1.5 rounded-full font-medium whitespace-nowrap hover:bg-[#FFF0E6] hover:text-orange-600 transition-colors">🔍 搜索产品</button>
                    <button className="text-[11px] bg-[#F5F5F5] text-gray-500 px-3 py-1.5 rounded-full font-medium whitespace-nowrap hover:bg-[#FFF0E6] hover:text-orange-600 transition-colors">🧮 保费计算</button>
                </div>

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

export default MobileChatInterface;
