
import React from 'react';

const CustomerCard1: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F3F4F6] font-['Noto_Sans_SC'] p-5">
            {/* Card 1 */}
            <div className="bg-white rounded-[16px] border border-white shadow-[0_2px_6px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] p-3 w-full max-w-[360px] mx-auto active:scale-99 transition-transform">
                <div className="flex items-center justify-between mb-3 relative group cursor-pointer">
                    <div className="absolute inset-0 z-10" onClick={() => alert('跳转到客户详情页')}></div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center text-base font-bold shrink-0">
                            王
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900 leading-none">王志远</h3>
                                <div className="flex gap-0.5">
                                    <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                    <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                                    <div className="w-1 h-3 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">企业高管</span>
                                <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">预算8W</span>
                            </div>
                        </div>
                    </div>

                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs group-hover:text-orange-500 transition-colors"></i>
                </div>

                <div className="flex gap-2 h-11 relative z-20">
                    <button className="flex-1 bg-[#F9FAFB] border border-[#F3F4F6] hover:bg-[#FFF7ED] hover:border-[#FFEDD5] active:bg-[#FFEDD5] transition-all rounded-lg px-3 flex flex-col justify-center gap-0.5 group text-left relative overflow-hidden">
                        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-orange-400 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-gray-700 truncate max-w-[160px] group-hover:text-orange-700">
                                <i className="fa-solid fa-reply text-[10px] text-gray-400 mr-1 rotate-180"></i>
                                方案生成: 重疾险V2
                            </span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">昨天</span>
                        </div>
                        <span className="text-[10px] text-gray-400 truncate group-hover:text-orange-400/80 pl-4">
                            包含定期vs终身对比...
                        </span>
                    </button>

                    <button title="新建对话" className="w-11 h-11 rounded-lg flex items-center justify-center text-gray-400 bg-white border border-dashed border-[#D1D5DB] hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 active:bg-[#FF6B35] active:text-white active:border-[#FF6B35] active:border-solid transition-all">
                        <i className="fa-solid fa-plus text-sm"></i>
                    </button>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[16px] border border-white shadow-[0_2px_6px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] p-3 w-full max-w-[360px] mx-auto mt-4 opacity-90 active:scale-99 transition-transform">
                <div className="flex items-center justify-between mb-3 relative group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 flex items-center justify-center text-base font-bold shrink-0">
                            张
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900 leading-none">张伟</h3>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">新客户</span>
                            </div>
                        </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
                </div>

                <button className="w-full h-11 rounded-lg bg-gray-900 text-white flex items-center justify-center gap-2 text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm relative z-20">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> 开启第一次对话
                </button>
            </div>
        </div>
    );
};

export default CustomerCard1;
