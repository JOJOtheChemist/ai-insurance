
import React from 'react';

const CRMCard: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F2F4F6] font-['Noto_Sans_SC'] p-5 overflow-auto">

            <div className="w-[400px] bg-white rounded-[40px] shadow-[0_25px_50px_-12px_rgba(255,107,53,0.15)] border border-orange-100 overflow-hidden flex flex-col relative h-[780px]">

                <div className="p-6 pb-2">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-orange-200">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-full h-full rounded-full bg-white border-2 border-white" alt="Avatar" />
                                </div>
                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">王志远</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500"><i className="fa-solid fa-briefcase mr-1"></i>科技公司 CTO</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-xs text-gray-500">42岁</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-xs font-bold text-orange-500 mb-1">成交意向极高</div>
                            <div className="flex gap-1">
                                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                <div className="w-2 h-6 bg-orange-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 rounded-full">已婚育(2子)</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200 rounded-full">北京海淀</span>
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100 rounded-full">老客户转化</span>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent my-1"></div>

                <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4 scrollbar-hide">

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#FFF5F0] rounded-[24px] p-4 flex flex-col justify-between h-32 border border-orange-100 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-200/30 rounded-full"></div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider"><i className="fa-solid fa-wallet mr-1"></i>年预算</span>
                            <div>
                                <span className="text-3xl font-bold text-gray-800">5-8</span>
                                <span className="text-sm font-bold text-gray-500">万</span>
                            </div>
                            <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2">
                                <div className="bg-orange-500 h-1.5 rounded-full w-[70%]"></div>
                            </div>
                        </div>

                        <div className="bg-white border border-red-100 rounded-[24px] p-4 flex flex-col gap-2 h-32 shadow-sm">
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider"><i className="fa-solid fa-triangle-exclamation mr-1"></i>抗拒点</span>
                            <div className="flex flex-wrap gap-2 content-start">
                                <span className="px-2 py-1 bg-red-50 text-red-500 text-[10px] font-bold border border-red-100 truncate w-full text-center rounded-full">
                                    觉得重疾险是骗人的
                                </span>
                                <span className="px-2 py-1 bg-red-50 text-red-500 text-[10px] font-bold border border-red-100 truncate w-full text-center rounded-full">
                                    曾有拒赔经历
                                </span>
                            </div>
                        </div>

                        <div className="col-span-2 bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">核心需求 Need</span>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                                    <i className="fa-solid fa-heart-pulse text-orange-400 text-lg mb-1"></i>
                                    <p className="text-xs font-bold text-gray-700">重疾保障</p>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                                    <i className="fa-solid fa-user-graduate text-blue-400 text-lg mb-1"></i>
                                    <p className="text-xs font-bold text-gray-700">子女教育</p>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center border border-gray-100 opacity-50">
                                    <i className="fa-solid fa-wheelchair text-gray-400 text-lg mb-1"></i>
                                    <p className="text-xs font-bold text-gray-500">养老规划</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3 px-1">
                            <span className="text-xs font-bold text-gray-800">⚡️ 智能推荐方案</span>
                            <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">匹配度 95%</span>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-[24px] p-5 shadow-lg shadow-orange-200 relative overflow-hidden group cursor-pointer">
                            <i className="fa-solid fa-shield-halved absolute -right-6 -bottom-6 text-[100px] text-white opacity-10 group-hover:scale-110 transition-transform"></i>

                            <div className="relative z-10">
                                <div className="text-xs font-medium text-orange-100 mb-1">旗舰版组合</div>
                                <h3 className="text-xl font-bold mb-3">无忧人生 · 家庭守护 Pro</h3>

                                <div className="flex gap-3 text-xs mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                                        <span className="opacity-70">重疾</span> 100万
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                                        <span className="opacity-70">医疗</span> 400万
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/20 pt-3">
                                    <div>
                                        <div className="text-[10px] text-orange-100">预估年缴</div>
                                        <div className="text-lg font-bold">¥ 18,500</div>
                                    </div>
                                    <button className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-50 transition-colors shadow-sm">
                                        发送计划书
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block px-1">Timeline</span>

                        <div className="space-y-0 relative">
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                            <div className="flex gap-4 relative group">
                                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center border-2 border-white z-10 shadow-sm shrink-0">
                                    <i className="fa-solid fa-comment-dots text-xs"></i>
                                </div>
                                <div className="pb-6">
                                    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm group-hover:border-orange-200 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-gray-700">补充客户信息</span>
                                            <span className="text-[10px] text-gray-400">14:32</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">确认了年收入范围在80万左右，且有轻度脂肪肝。</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 relative group">
                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center border-2 border-white z-10 shadow-sm shrink-0">
                                    <i className="fa-solid fa-file-invoice text-xs"></i>
                                </div>
                                <div className="pb-6">
                                    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm group-hover:border-blue-200 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-gray-700">生成对比方案</span>
                                            <span className="text-[10px] text-gray-400">14:35</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded-full">定期版</span>
                                            <span className="text-[10px] text-gray-400">vs</span>
                                            <span className="px-2 py-0.5 bg-orange-50 text-[10px] text-orange-500 border border-orange-100 rounded-full">终身版</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur">
                    <button className="w-full py-3 rounded-full border-2 border-dashed border-gray-300 text-gray-400 font-bold text-sm hover:border-orange-400 hover:text-orange-500 transition-all flex items-center justify-center gap-2">
                        <i className="fa-solid fa-pen-to-square"></i> 编辑客户档案
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CRMCard;
