
import React from 'react';

const CustomerCard2: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F3F4F6] font-['Noto_Sans_SC'] p-5 space-y-4">

            {/* Card 1: Hot */}
            <div className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-transform active:scale-99 w-full max-w-sm mx-auto">
                <div className="h-[3px] w-full bg-[#FF6B35]"></div>

                <div className="p-3">
                    <div className="flex justify-between items-start mb-3 relative">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold text-base shrink-0">
                                王
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-900 leading-none">王志远</h3>
                                    <span className="text-[10px] text-orange-600 bg-orange-50 px-1 rounded font-medium">HOT</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">企业高管</span>
                                    <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">预算8W</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-8 h-8 -mr-2 -mt-2 flex items-center justify-center text-gray-300 hover:text-orange-500">
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>

                    <div className="flex gap-2 h-11">
                        <button className="flex-1 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-100 rounded-lg px-3 flex items-center justify-between group transition-colors text-left">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <i className="fa-solid fa-clock-rotate-left text-gray-400 text-xs group-hover:text-orange-400"></i>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-700 truncate w-32 sm:w-40 group-hover:text-gray-900">方案: 重疾险对比 V2</span>
                                    <span className="text-[10px] text-gray-400 truncate w-32 sm:w-40">昨天 · 包含了定期vs终身</span>
                                </div>
                            </div>
                            <i className="fa-solid fa-play text-[10px] text-gray-300 group-hover:text-orange-500 ml-2"></i>
                        </button>

                        <button className="w-11 bg-white border border-dashed border-gray-300 text-gray-400 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm">
                            <i className="fa-solid fa-plus text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Card 2: Normal */}
            <div className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-transform active:scale-99 w-full max-w-sm mx-auto">
                <div className="h-[3px] w-full bg-[#E5E7EB]"></div>

                <div className="p-3">
                    <div className="flex justify-between items-start mb-3 relative">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center font-bold text-base shrink-0">
                                李
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-bold text-gray-900 leading-none">李晓雯</h3>
                                <div className="flex gap-1">
                                    <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">教师</span>
                                    <span className="text-[10px] px-[6px] py-[2px] rounded-[4px] bg-[#F9FAFB] text-[#6B7280] border border-[#F3F4F6]">二胎</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-8 h-8 -mr-2 -mt-2 flex items-center justify-center text-gray-300 hover:text-gray-600">
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>

                    <div className="flex gap-2 h-11">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-3 flex items-center justify-between group transition-colors text-left">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <i className="fa-solid fa-comment-dots text-gray-400 text-xs"></i>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-700 truncate">咨询: 子女教育金</span>
                                    <span className="text-[10px] text-gray-400">3天前 · 初步沟通</span>
                                </div>
                            </div>
                            <i className="fa-solid fa-play text-[10px] text-gray-300 ml-2"></i>
                        </button>

                        <button className="w-11 bg-white border border-dashed border-gray-300 text-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-sm">
                            <i className="fa-solid fa-plus text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CustomerCard2;
