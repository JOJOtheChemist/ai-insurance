
import React from 'react';

const QuickInfoGuide: React.FC = () => {
    return (
        <div className="h-screen w-full flex overflow-hidden text-[#4A3B32] font-['Noto_Sans_SC'] bg-[#FFF5F0]">

            <main className="flex-1 flex flex-col h-full relative">

                <header className="h-16 flex items-center px-6 border-b border-orange-100 bg-white/70 backdrop-blur-md z-10 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-md">
                            <i className="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-sm">金牌助理 Jarvis</h1>
                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">实时辅助中</span>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-orange-500"><i className="fa-solid fa-ellipsis"></i></button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8" id="chat-container">

                    <div className="flex gap-3 items-start max-w-[90%]">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] mt-1">
                            AI
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-md border border-white/60 p-4 rounded-tl-none rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-sm text-sm">
                                为了给王总做精准的保费测算，我们需要确认一下他的大致年收入范围。
                            </div>

                            <div className="flex flex-col gap-2 mt-1">

                                <div className="flex flex-wrap gap-2">
                                    <button className="rounded-full px-4 py-1.5 bg-white border border-orange-200 text-orange-600 text-xs hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                        30-50万
                                    </button>
                                    <button className="rounded-full px-4 py-1.5 bg-white border border-orange-200 text-orange-600 text-xs hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                        50-100万
                                    </button>
                                    <button className="rounded-full px-4 py-1.5 bg-white border border-orange-200 text-orange-600 text-xs hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                        100万+
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">推荐方向</span>
                                    <div className="h-px bg-orange-100 flex-1"></div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button className="rounded-full bg-[#FFFAF5] border border-dashed border-[#FFB085] text-[#D95D26] px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all hover:bg-[#FFF0E6] hover:border-[#FF6B35]">
                                        <i className="fa-regular fa-lightbulb"></i> 询问是否有股票分红
                                    </button>
                                    <button className="rounded-full bg-[#FFFAF5] border border-dashed border-[#FFB085] text-[#D95D26] px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all hover:bg-[#FFF0E6] hover:border-[#FF6B35]">
                                        <i className="fa-solid fa-arrow-turn-up"></i> 礼貌询问配偶收入
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse gap-3 items-start self-end max-w-[85%] ml-auto">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-full border border-white shadow-sm bg-gray-100 flex-shrink-0 mt-1" />
                        <div className="bg-gray-800 text-white p-3.5 rounded-tr-none rounded-tl-3xl rounded-bl-3xl rounded-br-3xl shadow-[0_8px_20px_-8px_rgba(255,107,53,0.2)] text-sm">
                            年收入大概80万，但他比较反感透露具体的家庭资产，只聊保险本身。
                        </div>
                    </div>

                    <div className="flex gap-3 items-start max-w-[95%]">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] mt-1">
                            AI
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <div className="bg-white p-5 rounded-[24px] shadow-[0_8px_20px_-8px_rgba(255,107,53,0.2)] border-l-4 border-orange-500">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-gray-800">推荐：无忧人生·重疾守护计划 A</h3>
                                    <span className="text-orange-600 font-bold text-lg">¥18,500</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                                    既然客户对资产话题敏感，我们直接切入产品的<span className="text-orange-600 font-bold">“高隐私保护”</span>和<span className="text-orange-600 font-bold">“绿通服务”</span>，不谈理财属性。
                                </p>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-orange-50 text-orange-600 py-2 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors">
                                        查看详细条款
                                    </button>
                                    <button className="flex-1 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] text-white py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all">
                                        生成对比图
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">话术导航</span>
                                    <div className="h-px bg-orange-100 flex-1"></div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button className="rounded-full bg-[#FFFAF5] border border-dashed border-[#FFB085] text-[#D95D26] px-4 py-2 text-xs flex items-center gap-2 w-fit hover:bg-[#FFF0E6] hover:border-[#FF6B35] transition-all">
                                        <i className="fa-solid fa-microphone-lines"></i>
                                        <span className="text-xs font-bold text-gray-700">话术：王总，这款产品不仅是保障，更是您健康隐私的保险箱...</span>
                                    </button>
                                    <button className="rounded-full bg-[#FFFAF5] border border-dashed border-[#FFB085] text-[#D95D26] px-3 py-2 text-xs flex items-center gap-1.5 transition-all hover:bg-[#FFF0E6] hover:border-[#FF6B35]">
                                        <i className="fa-solid fa-share-nodes"></i> 发送同类理赔案例
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-32"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FFF5F0] via-[#FFF5F0] to-transparent pt-12 pb-6 px-6 z-20">

                    <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1 pl-1">
                        <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:text-orange-500 hover:border-orange-200 transition-all">
                            <i className="fa-solid fa-calendar-check"></i> 预约下次沟通
                        </button>
                        <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:text-orange-500 hover:border-orange-200 transition-all">
                            <i className="fa-solid fa-magnifying-glass"></i> 搜索产品库
                        </button>
                        <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:text-orange-500 hover:border-orange-200 transition-all">
                            <i className="fa-solid fa-file-contract"></i> 生成电子名片
                        </button>
                    </div>

                    <div className="bg-white p-2 rounded-[30px] shadow-[0_10px_40px_-10px_rgba(255,107,53,0.2)] border border-orange-100 flex items-center gap-2">
                        <button className="w-10 h-10 bg-gray-50 rounded-full text-gray-400 hover:text-orange-500 transition-colors">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <input type="text" placeholder="输入指令或客户反馈..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 h-10 px-2" />
                        <button className="w-12 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full text-white shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </main>

            {/* Sidebar */}
            <aside className="w-[380px] h-full bg-white/80 backdrop-blur-sm border-l border-orange-100 p-5 flex flex-col shadow-xl z-20 hidden md:flex">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Info</h2>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="col-span-2 bg-gradient-to-br from-orange-50 to-white rounded-[24px] p-4 border border-orange-100 flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-16 h-16 bg-orange-200/20 rounded-bl-full"></div>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-14 h-14 rounded-full bg-white p-1 shadow-sm" />
                        <div>
                            <h3 className="font-bold text-gray-800">王志远</h3>
                            <p className="text-xs text-gray-500">42岁 · 企业高管</p>
                            <div className="flex gap-1 mt-1.5">
                                <span className="text-[10px] bg-white border border-orange-100 px-2 py-0.5 rounded-full text-orange-600">高净值</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 bg-white rounded-[24px] p-4 border border-orange-100 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-600">风险画像</span>
                            <i className="fa-solid fa-heart-pulse text-orange-300 text-xs"></i>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] px-2 py-1 bg-red-50 text-red-500 rounded-full border border-red-100">轻度脂肪肝</span>
                            <span className="text-[10px] px-2 py-1 bg-red-50 text-red-500 rounded-full border border-red-100">经常熬夜</span>
                            <span className="text-[10px] px-2 py-1 border border-dashed border-gray-300 text-gray-400 rounded-full cursor-pointer hover:border-orange-300">+ 添加</span>
                        </div>
                    </div>

                    <div className="col-span-1 bg-orange-50/50 rounded-[24px] p-4 border border-orange-100 flex flex-col justify-center items-center gap-1 hover:bg-orange-50 transition-colors cursor-pointer">
                        <i className="fa-solid fa-users text-orange-400 text-xl mb-1"></i>
                        <span className="text-xs font-bold text-gray-600">家庭成员</span>
                        <span className="text-[10px] text-gray-400">3人 (已录入)</span>
                    </div>

                    <div className="col-span-1 bg-orange-50/50 rounded-[24px] p-4 border border-orange-100 flex flex-col justify-center items-center gap-1 hover:bg-orange-50 transition-colors cursor-pointer">
                        <i className="fa-solid fa-wallet text-orange-400 text-xl mb-1"></i>
                        <span className="text-xs font-bold text-gray-600">预算范围</span>
                        <span className="text-[10px] text-gray-400">¥2-5万/年</span>
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 rounded-[24px] p-4 border border-gray-100 overflow-hidden flex flex-col">
                    <span className="text-xs font-bold text-gray-600 mb-3">生成记录</span>
                    <div className="space-y-2 overflow-y-auto pr-1">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-gray-700">重疾险对比方案 V1</p>
                                <p className="text-[10px] text-gray-400">今日 14:20</p>
                            </div>
                            <button className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-xs hover:bg-orange-500 hover:text-white transition-colors">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center opacity-70">
                            <div>
                                <p className="text-xs font-bold text-gray-700">子女教育金草案</p>
                                <p className="text-[10px] text-gray-400">昨天</p>
                            </div>
                            <button className="w-6 h-6 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center text-xs">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

            </aside>
        </div>
    );
};

export default QuickInfoGuide;
