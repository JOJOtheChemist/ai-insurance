
import React from 'react';

const CustomerList15: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col text-[#111827] bg-[#F9FAFB] font-['Noto_Sans_SC']">
            {/* Header */}
            <header className="px-5 py-4 bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-gray-900">客户档案 <span className="text-sm font-normal text-gray-400 ml-1">42</span></h1>
                    <button className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
                        <i className="fa-solid fa-plus text-sm"></i>
                    </button>
                </div>

                <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300">
                    <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-2"></i>
                    <input type="text" placeholder="搜索姓名、标签..."
                        className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">

                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold border border-orange-200">
                                王
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-gray-900">王志远</h3>
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">上次跟进：今天 14:30</p>
                            </div>
                        </div>
                        <button className="text-gray-300 hover:text-orange-500 transition-colors">
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium bg-gray-100 text-gray-600">企业高管</span>
                        <span className="px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium bg-gray-100 text-gray-600">年预算8W</span>
                        <span className="px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium bg-orange-50 text-orange-600 font-bold">高意向</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2 border border-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors group">
                        <div className="mt-0.5 text-gray-400 group-hover:text-orange-400">
                            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-600 line-clamp-1 group-hover:text-gray-800">已生成《重疾险方案对比 V2》...</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">点击继续生成方案</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg font-bold border border-gray-200">
                                李
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-gray-900">李晓雯</h3>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">上次跟进：3天前</p>
                            </div>
                        </div>
                        <button className="text-gray-300 hover:text-orange-500 transition-colors">
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium bg-gray-100 text-gray-600">教师</span>
                        <span className="px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium bg-gray-100 text-gray-600">二胎妈妈</span>
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

                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg font-bold border border-gray-200">
                                张
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-gray-900">张伟</h3>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">休眠</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">上次跟进：2周前</p>
                            </div>
                        </div>
                        <button className="text-gray-300 hover:text-orange-500 transition-colors">
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium bg-gray-100 text-gray-600">自由职业</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                        <p className="text-xs text-gray-400">
                            <i className="fa-solid fa-plus mr-1"></i> 发起新会话
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all active:bg-[#FAFAFA] active:scale-98 p-4 flex flex-col gap-3 shadow-sm opacity-60">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-lg font-bold border border-gray-200">
                                陈
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">陈总</h3>
                                <p className="text-xs text-gray-400 mt-0.5">上次跟进：1个月前</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 h-16 flex justify-around items-center z-30 pb-2 text-xs">
                <div className="flex flex-col items-center gap-1 text-orange-600">
                    <i className="fa-solid fa-folder-user text-lg"></i>
                    <span className="font-bold">档案</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-layer-group text-lg"></i>
                    <span className="font-medium">工具</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-user text-lg"></i>
                    <span className="font-medium">我的</span>
                </div>
            </nav>
        </div>
    );
};

export default CustomerList15;
