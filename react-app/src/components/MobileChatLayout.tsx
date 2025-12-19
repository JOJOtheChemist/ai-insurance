
import React from 'react';

const MobileChatLayout: React.FC = () => {
    const handleProfileSheetToggle = () => {
        const sheet = document.getElementById('profile-sheet');
        if (sheet) {
            sheet.classList.toggle('translate-y-full');
        }
    };

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden text-[#4A3B32] bg-[#FFF5F0] font-['Noto_Sans_SC']">
            {/* Header */}
            <header className="h-14 bg-white/85 backdrop-blur-md border-b border-orange-500/10 flex items-center justify-between px-4 fixed top-0 w-full z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-sm">
                        <i className="fa-solid fa-robot text-xs"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">Jarvis <span className="text-[10px] text-green-500 font-normal">Online</span></span>
                    </div>
                </div>

                <button onClick={handleProfileSheetToggle}
                    className="flex items-center gap-2 bg-white border border-orange-100 px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-bold text-gray-700">王志远</span>
                    <i className="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                </button>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 overflow-y-auto px-4 pt-16 pb-36 space-y-6" id="chat-container">

                <div className="flex justify-center mt-2">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">今天 14:30</span>
                </div>

                {/* AI Bubble */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-start max-w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-500 text-[10px] mt-1">
                            AI
                        </div>
                        <div className="bg-white p-3 shadow-sm text-sm text-gray-700 leading-relaxed rounded-tr-3xl rounded-br-3xl rounded-bl-3xl rounded-tl-sm border border-gray-100">
                            为了给王总做精准测算，我们需要确认一下大致的年收入范围？
                        </div>
                    </div>

                    <div className="pl-10 w-full overflow-x-auto no-scrollbar flex gap-2 pr-4">
                        <button className="flex-shrink-0 px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-full text-xs font-medium shadow-sm active:bg-orange-500 active:text-white transition-colors">
                            30-50万
                        </button>
                        <button className="flex-shrink-0 px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-full text-xs font-medium shadow-sm active:bg-orange-500 active:text-white transition-colors">
                            50-80万
                        </button>
                        <button className="flex-shrink-0 px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-full text-xs font-medium shadow-sm active:bg-orange-500 active:text-white transition-colors">
                            100万+
                        </button>
                    </div>
                </div>

                {/* User Bubble */}
                <div className="flex flex-row-reverse gap-2 items-start max-w-[90%] ml-auto">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm mt-1" />
                    <div className="bg-gray-800 text-white p-3 shadow-sm text-sm leading-relaxed rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm">
                        大概80万左右，但他比较反感聊资产，只关心产品本身。
                    </div>
                </div>

                {/* AI Bubble with Strategy Card */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-start max-w-[95%]">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-500 text-[10px] mt-1">
                            AI
                        </div>

                        <div className="w-full bg-gradient-to-b from-orange-50 to-white border border-orange-200 rounded-[20px] p-3 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>

                            <div className="flex items-center gap-2 mb-2 pl-2">
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                                    <i className="fa-solid fa-lightbulb mr-1"></i>策略：避谈资产，只谈隐私
                                </span>
                            </div>

                            <div className="pl-2 relative">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    “王总，这款产品最大的优势就是<span className="text-orange-600 font-bold border-b border-orange-300">‘隐私保护’</span>。它不需要关联家庭其他资产，是完全独立的健康账户...”
                                </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-orange-100 flex gap-2 pl-2">
                                <button className="flex-1 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1">
                                    <i className="fa-regular fa-copy"></i> 复制话术
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 text-xs rounded-full shadow-sm">
                                    <i className="fa-solid fa-rotate"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pl-10 w-full overflow-x-auto no-scrollbar flex gap-2 pr-4">
                        <button className="flex-shrink-0 bg-[#FDF4FF] border border-dashed border-[#D8B4FE] text-[#9333EA] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1 active:bg-purple-100">
                            <i className="fa-solid fa-share-nodes"></i> 发送绿通服务案例
                        </button>
                        <button className="flex-shrink-0 bg-[#FDF4FF] border border-dashed border-[#D8B4FE] text-[#9333EA] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1 active:bg-purple-100">
                            <i className="fa-solid fa-scale-balanced"></i> 生成定期vs终身对比
                        </button>
                        <button className="flex-shrink-0 bg-[#FDF4FF] border border-dashed border-[#D8B4FE] text-[#9333EA] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1 active:bg-purple-100">
                            <i className="fa-regular fa-comment-dots"></i> 询问是否有体检报告
                        </button>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-orange-100 px-4 py-3 z-30 pb-6">
                <div className="flex gap-3 mb-3 overflow-x-auto no-scrollbar">
                    <div className="text-[10px] text-gray-400 whitespace-nowrap pt-1">全局指令:</div>
                    <button className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">预约沟通</button>
                    <button className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">搜索产品</button>
                    <button className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">计算器</button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-200">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    <div className="flex-1 bg-gray-100 rounded-full flex items-center px-3 h-10 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all">
                        <input type="text" placeholder="输入指令或粘贴客户回复..."
                            className="flex-1 bg-transparent text-sm outline-none text-gray-700" />
                        <button className="text-gray-400"><i className="fa-solid fa-microphone"></i></button>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-200 active:scale-95 transition-transform">
                        <i className="fa-solid fa-paper-plane text-sm"></i>
                    </button>
                </div>
            </footer>

            {/* Profile Sheet */}
            <div id="profile-sheet"
                className="fixed inset-x-0 bottom-0 z-50 transform translate-y-full transition-transform duration-300 ease-out h-[85vh] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col border-t border-orange-100">

                <div className="w-full flex justify-center pt-3 pb-1" onClick={handleProfileSheetToggle}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full cursor-pointer"></div>
                </div>

                <div className="px-6 py-4 border-b border-gray-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">王志远</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold">CTO</span>
                                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[10px] font-bold">高净值</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-1" onClick={handleProfileSheetToggle}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAFB]">

                    <div className="flex gap-3">
                        <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">年预算</div>
                            <div className="text-lg font-bold text-gray-800">5-8万</div>
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">意向度</div>
                            <div className="flex gap-1 mt-1">
                                <div className="w-2 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-2 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-2 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-2 h-4 bg-gray-200 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="fa-solid fa-address-card text-blue-400 text-xs"></i>
                            <span className="text-xs font-bold text-gray-700">AI 画像</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">现金流敏感</span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">轻度脂肪肝</span>
                        </div>

                        <div className="h-px bg-gray-100 my-3"></div>

                        <div className="flex items-center gap-2 mb-2">
                            <i className="fa-solid fa-triangle-exclamation text-red-400 text-xs"></i>
                            <span className="text-xs font-bold text-gray-700">核心抗拒</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold border border-red-100">嫌保费贵</span>
                            <span className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold border border-red-100">反感查资产</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between px-1 mb-2">
                            <span className="text-xs font-bold text-gray-500">推荐方案记录</span>
                            <span className="text-[10px] text-orange-500">查看全部</span>
                        </div>
                        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar snap-x">
                            <div className="min-w-[80%] snap-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-100">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full border border-white/20">本人</span>
                                    <span className="text-lg font-bold">¥18,500</span>
                                </div>
                                <div className="text-sm font-bold mb-1">无忧人生 Pro</div>
                                <div className="text-[10px] opacity-80">重疾 + 医疗组合</div>
                            </div>
                            <div className="min-w-[80%] snap-center bg-white border border-gray-200 rounded-2xl p-4 text-gray-600 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">长子</span>
                                    <span className="text-lg font-bold">¥30万</span>
                                </div>
                                <div className="text-sm font-bold mb-1">教育金储备</div>
                                <div className="text-[10px] text-gray-400">待确认方案</div>
                            </div>
                        </div>
                    </div>

                    <div className="h-10"></div>
                </div>
            </div>
        </div>
    );
};

export default MobileChatLayout;
