
import React from 'react';

const DualCard: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F0F2F5] font-['Noto_Sans_SC'] p-5 overflow-auto">

            <div className="w-[400px] bg-white rounded-[40px] shadow-[0_20px_40px_-10px_rgba(255,107,53,0.12)] border border-orange-100 overflow-hidden flex flex-col max-h-[850px]">

                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100" alt="Avatar" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">王志远</h2>
                            <p className="text-xs text-gray-400">最后更新: 刚刚</p>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="text-[10px] text-gray-400 uppercase font-bold">意向度</div>
                            <div className="flex gap-0.5">
                                <div className="w-1.5 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-1.5 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-1.5 h-4 bg-orange-500 rounded-sm"></div>
                                <div className="w-1.5 h-4 bg-orange-200 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-6 scrollbar-thin scrollbar-thumb-orange-200 space-y-3">

                    <div className="grid grid-cols-2 gap-3 h-48">

                        <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-3 flex flex-col h-full relative overflow-hidden group">
                            <div className="flex items-center gap-1.5 mb-2 shrink-0">
                                <i className="fa-solid fa-address-card text-slate-400 text-xs"></i>
                                <span className="text-xs font-bold text-slate-600">画像特征</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1">
                                <div className="flex flex-wrap gap-1.5 content-start">
                                    <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">
                                        🏢 企业高管
                                    </span>
                                    <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">
                                        💰 现金流敏感
                                    </span>
                                    <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">
                                        📉 风险厌恶型
                                    </span>
                                    <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">
                                        🏥 轻度脂肪肝
                                    </span>
                                    <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1">
                                        👨‍👩‍👦 责任心强
                                    </span>
                                    <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-slate-200 text-slate-600 bg-white mb-1 opacity-60">
                                        🏷️ 对保险条款较懂
                                    </span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                        </div>

                        <div className="bg-orange-50/50 border border-orange-100 rounded-[24px] p-3 flex flex-col h-full relative overflow-hidden">
                            <div className="flex items-center gap-1.5 mb-2 shrink-0">
                                <i className="fa-solid fa-bullseye text-orange-400 text-xs"></i>
                                <span className="text-xs font-bold text-orange-600">痛点 & 需求</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1">
                                <div className="flex flex-col gap-2">
                                    <div className="text-[10px] text-gray-400 font-bold ml-1">想要什么</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-orange-200 text-orange-600 bg-white mb-1">
                                            高杠杆重疾险
                                        </span>
                                        <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-orange-200 text-orange-600 bg-white mb-1">
                                            子女教育储蓄
                                        </span>
                                    </div>

                                    <div className="text-[10px] text-gray-400 font-bold ml-1 mt-1">担心什么</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-red-100 text-red-500 bg-white mb-1">
                                            😟 怕保费断缴
                                        </span>
                                        <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-red-100 text-red-500 bg-white mb-1">
                                            😟 担心理赔难
                                        </span>
                                        <span className="text-[11px] px-2.5 py-1 rounded-[8px] rounded-tl-[16px] rounded-br-[16px] border border-red-100 text-red-500 bg-white mb-1">
                                            😟 资金流动性差
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#FFF9F5] to-transparent pointer-events-none"></div>
                        </div>
                    </div>



                    <div className="relative w-full h-32 rounded-[24px] overflow-hidden group cursor-pointer shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FF8E53]"></div>

                        <div className="absolute -right-6 -bottom-8 text-white opacity-10 text-9xl">
                            <i className="fa-brands fa-pagelines"></i>
                        </div>

                        <div className="relative z-10 p-5 flex flex-col justify-between h-full text-white">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/20">
                                        ✨ AI 严选
                                    </span>
                                    <span className="text-xl font-bold">¥18,500<span className="text-xs font-normal opacity-80">/年</span></span>
                                </div>
                                <h3 className="text-lg font-bold mt-1">无忧人生 · 降维打击版</h3>
                                <p className="text-[10px] opacity-80 mt-0.5">组合策略：定期重疾 + 百万医疗 + 意外险</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-xs border border-orange-300 shadow-sm" title="重疾"><i className="fa-solid fa-heart-pulse"></i></div>
                                    <div className="w-6 h-6 rounded-full bg-white text-blue-500 flex items-center justify-center text-xs border border-blue-300 shadow-sm" title="医疗"><i className="fa-solid fa-user-doctor"></i></div>
                                    <div className="w-6 h-6 rounded-full bg-white text-green-500 flex items-center justify-center text-xs border border-green-300 shadow-sm" title="意外"><i className="fa-solid fa-person-falling-burst"></i></div>
                                </div>
                                <button className="bg-white text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors">
                                    查看详情
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-2"></div>
                </div>

            </div>
        </div>
    );
};

export default DualCard;
