
import React from 'react';

const PlanRecommendationCard: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F0F2F5] font-['Noto_Sans_SC'] p-5 overflow-auto">

            <div className="w-[400px] bg-white rounded-[40px] shadow-[0_20px_40px_-10px_rgba(255,107,53,0.12)] border border-orange-100 overflow-hidden flex flex-col h-[880px]">

                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100" alt="Avatar" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">王志远</h2>
                            <p className="text-xs text-gray-400">意向度：高 🔥</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 space-y-3 scrollbar-hide">

                    <div className="grid grid-cols-2 gap-3 h-40">
                        <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-3 overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-2"><i className="fa-solid fa-address-card text-slate-400 text-xs"></i><span className="text-xs font-bold text-slate-600">画像</span></div>
                            <div className="flex flex-wrap gap-1.5 content-start">
                                <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">🏢 企业高管</span>
                                <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">💰 现金流敏感</span>
                                <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">📉 风险厌恶</span>
                            </div>
                        </div>
                        <div className="bg-orange-50/50 border border-orange-100 rounded-[24px] p-3 overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-2"><i className="fa-solid fa-bullseye text-orange-400 text-xs"></i><span className="text-xs font-bold text-orange-600">需求</span></div>
                            <div className="flex flex-wrap gap-1.5 content-start">
                                <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-orange-200 text-orange-600 bg-white mb-1">高杠杆重疾</span>
                                <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-red-100 text-red-500 bg-white mb-1">😟 怕保费贵</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-[24px] p-3 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-8 h-8 rounded-full border border-green-400 bg-gray-50" alt="Avatar" />
                            <div className="h-px w-4 bg-gray-300"></div>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wife" className="w-8 h-8 rounded-full border border-orange-300 bg-gray-50 grayscale opacity-70" alt="Avatar" />
                            <div className="h-px w-4 bg-gray-300"></div>
                            <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-300">
                                <i className="fa-solid fa-plus"></i></div>
                        </div>
                        <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full">配偶缺口</span>
                    </div>

                </div>

                <div className="mt-2 pb-6 border-t border-gray-50 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-10">

                    <div className="px-6 py-3 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-orange-500"></i> 方案记录 (3)
                        </span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x snap-mandatory scrollbar-hide">

                        <div className="min-w-[85%] snap-center relative rounded-[24px] overflow-hidden shadow-lg shadow-orange-100 group cursor-pointer h-40">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FF9A5C]"></div>
                            <i className="fa-solid fa-wand-magic-sparkles absolute top-3 right-3 text-white/20 text-4xl"></i>

                            <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/30 flex items-center gap-1">
                                            <i className="fa-solid fa-user"></i> 本人 · 王志远
                                        </span>
                                        <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">Hot</span>
                                    </div>
                                    <h3 className="text-lg font-bold">无忧人生 · 降维打击版</h3>
                                    <p className="text-[10px] text-orange-100 mt-0.5 opacity-90">刚刚生成 · 针对现金流优化</p>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/20 pt-2">
                                    <div>
                                        <span className="text-[10px] opacity-80">年缴保费</span>
                                        <div className="text-xl font-bold leading-none">¥6,240</div>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-white text-orange-500 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                        <i className="fa-solid fa-chevron-right text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="min-w-[85%] snap-center relative rounded-[24px] bg-white border border-gray-200 shadow-sm group cursor-pointer h-40">
                            <div className="p-5 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                                            <i className="fa-solid fa-child-reaching"></i> 长子 · 10岁
                                        </span>
                                        <span className="text-[10px] text-gray-400">昨天</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700">天天向上 · 教育金储备</h3>
                                    <p className="text-[10px] text-gray-400 mt-0.5">历史方案 · 待确认</p>
                                </div>

                                <div className="flex justify-between items-end border-t border-gray-100 pt-2">
                                    <div>
                                        <span className="text-[10px] text-gray-400">预计总投</span>
                                        <div className="text-lg font-bold text-gray-700 leading-none">¥30万</div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 border border-white flex items-center justify-center text-[10px]">
                                            <i className="fa-solid fa-graduation-cap"></i></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 border border-white flex items-center justify-center text-[10px]">
                                            +2</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-w-[30%] snap-center relative rounded-[24px] border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 h-40">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <i className="fa-solid fa-plus text-gray-400"></i>
                            </div>
                            <span className="text-xs font-bold text-gray-500">新建方案</span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlanRecommendationCard;
