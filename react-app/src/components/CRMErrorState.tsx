
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CRMErrorStateProps {
    hideNav?: boolean;
}

const CRMErrorState: React.FC<CRMErrorStateProps> = ({ hideNav = false }) => {
    const navigate = useNavigate();
    const [expandedCard, setExpandedCard] = useState<number | null>(0); // Default expand first card
    const [historyVisible, setHistoryVisible] = useState<{ [key: number]: boolean }>({ 0: true }); // Default visible for first card

    const toggleHistory = (index: number) => {
        setHistoryVisible(prev => ({ ...prev, [index]: !prev[index] }));
        if (expandedCard !== index) {
            setExpandedCard(index);
        } else if (historyVisible[index]) {
            // content hidden, maybe collapse card? keeping logic simple as per template
            setExpandedCard(null);
        }
    };

    return (
        <div className="h-full w-full flex flex-col text-[#5C4B41] bg-[#FFF9F5] font-['Noto_Sans_SC']">
            {/* Header */}
            <header className="px-5 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-[#FFE4D6]">
                <h1 className="text-xl font-bold mb-3">我的客户 <span className="text-sm font-normal text-gray-400 ml-1">(42)</span></h1>

                <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-[#F7F5F2] rounded-full flex items-center px-4 border border-transparent focus-within:border-orange-200 focus-within:bg-white transition-all">
                        <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-2"></i>
                        <input type="text" placeholder="搜索姓名、标签..."
                            className="bg-transparent text-sm outline-none flex-1 text-[#5C4B41] placeholder-gray-400" />
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white border border-[#EAE0D5] text-[#8C7364] flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-sliders"></i>
                    </button>
                </div>

                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                    <button className="px-3 py-1 bg-[#5C4B41] text-white rounded-full text-xs font-bold">全部</button>
                    <button className="px-3 py-1 bg-white border border-[#EAE0D5] text-[#8C7364] rounded-full text-xs whitespace-nowrap">高意向 🔥</button>
                    <button className="px-3 py-1 bg-white border border-[#EAE0D5] text-[#8C7364] rounded-full text-xs whitespace-nowrap">待跟进 ⏳</button>
                    <button className="px-3 py-1 bg-white border border-[#EAE0D5] text-[#8C7364] rounded-full text-xs whitespace-nowrap">已成交 ✅</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">

                {/* Card 1: Wang Zhiyuan */}
                <div className={`client-card overflow-hidden group ${expandedCard === 0 ? 'expanded bg-white border-[#FFDCC2] shadow-[0_10px_30px_rgba(255,107,53,0.1)]' : 'bg-white border-[#FFE4D6]'}`}>
                    <div className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="relative">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        王志远
                                        <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100">高意向</span>
                                    </h3>
                                    <p className="text-xs text-[#9A897D] mt-0.5">上次活跃：刚刚</p>
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-[#F7F5F2] text-[#8C7364] flex items-center justify-center text-xs hover:bg-[#FFF0E6] hover:text-orange-500 transition-colors">
                                <i className="fa-solid fa-phone"></i>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="tag-pill bg-[#FFF0E6] text-[#D94F1A]">💰 年预算8万+</span>
                            <span className="tag-pill bg-[#F2F7FF] text-[#4B7BEC]">🏢 互联网高管</span>
                            <span className="tag-pill bg-[#FFF5F5] text-[#E05666]">⚠️ 脂肪肝</span>
                        </div>
                    </div>

                    <div className="bg-[#FAFAFA] border-t border-[#F0F0F0] p-4">
                        <div className="flex gap-2 mb-3">
                            <button onClick={() => navigate('/composite-chat-full')} className="flex-1 bg-gradient-to-r from-[#FF8850] to-[#FF6B35] text-white py-2.5 rounded-full text-xs font-bold shadow-md shadow-orange-100 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                <i className="fa-solid fa-comment-medical"></i> 发起新对话
                            </button>
                            <button onClick={() => toggleHistory(0)}
                                className="px-4 py-2.5 rounded-full border border-[#E0E0E0] bg-white text-[#5C4B41] text-xs font-bold flex items-center gap-1 active:bg-gray-50">
                                历史记录 <i className={`fa-solid ${historyVisible[0] ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px] ml-1 transition-transform`}></i>
                            </button>
                        </div>

                        {historyVisible[0] && (
                            <div className="history-list space-y-2">
                                <div className="text-[10px] text-[#9A897D] font-bold mb-2 uppercase tracking-wider pl-1">Recent Sessions</div>
                                <div className="history-item flex items-center justify-between p-3 bg-white border border-[#F0F0F0] cursor-pointer rounded-[16px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-orange-500 flex items-center justify-center text-xs shrink-0">
                                            <i className="fa-solid fa-file-invoice-dollar"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-800">重疾险方案对比 V2</h4>
                                            <p className="text-[10px] text-gray-400 mt-0.5">包含了定期vs终身的详细测算...</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-300">昨天</span>
                                </div>
                                <div className="history-item flex items-center justify-between p-3 bg-white border border-[#F0F0F0] cursor-pointer rounded-[16px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs shrink-0">
                                            <i className="fa-solid fa-child-reaching"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-800">子女教育金咨询</h4>
                                            <p className="text-[10px] text-gray-400 mt-0.5">初步沟通了预算和年限...</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-300">3天前</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 2: Li Xiaowen */}
                <div className={`client-card overflow-hidden ${expandedCard === 1 ? 'expanded bg-white border-[#FFDCC2] shadow-[0_10px_30px_rgba(255,107,53,0.15)]' : 'bg-white border-[#FFE4D6]'}`}>
                    <div className="p-5 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Li" className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200" />
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        李晓雯
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">待跟进</span>
                                    </h3>
                                    <p className="text-xs text-[#9A897D] mt-0.5">上次活跃：5天前</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="tag-pill bg-[#F7F5F2] text-[#8C7364]">👶 二胎妈妈</span>
                            <span className="tag-pill bg-[#F7F5F2] text-[#8C7364]">🏥 关注医疗险</span>
                        </div>
                    </div>

                    <div className="bg-[#FAFAFA] border-t border-[#F0F0F0] p-3 flex gap-2">
                        <button onClick={() => navigate('/composite-chat-full')} className="flex-1 bg-white border border-[#E0E0E0] text-[#5C4B41] py-2 rounded-full text-xs font-bold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors">
                            <i className="fa-solid fa-comment-dots mr-1"></i> 发起对话
                        </button>
                        <button onClick={() => toggleHistory(1)}
                            className="px-4 py-2 rounded-full bg-[#F5F5F5] text-[#9A897D] text-xs font-bold">
                            <i className={`fa-solid ${historyVisible[1] ? 'fa-clock-rotate-left text-orange-500' : 'fa-clock-rotate-left'}`}></i>
                        </button>
                    </div>

                    {historyVisible[1] && (
                        <div className="history-list p-4 bg-[#FAFAFA] border-t border-[#F0F0F0]">
                            <div className="history-item flex items-center justify-between p-3 bg-white border border-[#F0F0F0] rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
                                        <i className="fa-solid fa-comment"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800">初步接触</h4>
                                        <p className="text-[10px] text-gray-400">询问了高端医疗险...</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-300">11月24日</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="client-card p-5 flex items-center justify-center text-gray-300 text-sm">
                    --- 没有更多了 ---
                </div>

            </main>

            {/* Navigation */}
            {!hideNav && (
                <nav className="fixed bottom-0 w-full bg-white border-t border-[#F0F0F0] h-16 flex justify-around items-center z-30 pb-2">
                    <a href="#" className="flex flex-col items-center gap-1 text-[#FF6B35]">
                        <i className="fa-solid fa-address-book text-xl"></i>
                        <span className="text-[10px] font-bold">客户</span>
                    </a>
                    <a href="#" className="flex flex-col items-center gap-1 text-[#C4B5AD]">
                        <i className="fa-solid fa-robot text-xl"></i>
                        <span className="text-[10px] font-bold">助理</span>
                    </a>
                    <a href="#" className="flex flex-col items-center gap-1 text-[#C4B5AD]">
                        <i className="fa-solid fa-user text-xl"></i>
                        <span className="text-[10px] font-bold">我的</span>
                    </a>
                </nav>
            )}
        </div>
    );
};


export default CRMErrorState;
