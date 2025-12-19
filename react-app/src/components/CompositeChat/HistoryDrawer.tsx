import React from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    customerProfile: CustomerProfile | null;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
    isOpen,
    onClose,
    customerProfile
}) => {
    return (
        <div
            className={`fixed inset-y-0 left-0 w-[85%] max-w-md bg-[#F9FAFB] shadow-2xl z-[60] flex flex-col border-r border-gray-100 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white sticky top-0 z-10">
                <span className="text-sm font-bold text-gray-800">历史会话</span>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
                {/* Card 1 */}
                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-base font-bold border border-orange-200">
                                {customerProfile?.name?.charAt(0) || '王'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-900">{customerProfile?.name || '王志远'}</h3>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">今天 14:30</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium bg-gray-100 text-gray-600">企业高管</span>
                        <span className="px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium bg-orange-50 text-orange-600 font-bold">高意向</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2 border border-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors group">
                        <div className="mt-0.5 text-gray-400 group-hover:text-orange-400">
                            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-600 line-clamp-1 group-hover:text-gray-800">已生成《重疾险方案对比 V2》</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">点击继续会话</p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-base font-bold border border-blue-100">
                                李
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-900">李晓雯</h3>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">3天前</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-[8px] py-[3px] rounded-[6px] text-[10px] font-medium bg-gray-100 text-gray-600">二胎妈妈</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2 border border-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors group">
                        <div className="mt-0.5 text-gray-400 group-hover:text-orange-400">
                            <i className="fa-solid fa-comment-dots text-xs"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-600 line-clamp-1 group-hover:text-gray-800">咨询了子女教育金的初步规划</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">点击进入会话</p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm grayscale opacity-70">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-base font-bold border border-gray-200">
                                陈
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-900">陈总</h3>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">休眠</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">1个月前</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                        <p className="text-xs text-gray-400">
                            <i className="fa-solid fa-plus mr-1"></i> 发起新会话
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
