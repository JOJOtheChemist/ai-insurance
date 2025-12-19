
import React from 'react';

const OptimizedCustomerCard: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F2F4F6] font-['Noto_Sans_SC'] p-5 overflow-auto">

            <div className="w-[400px] bg-white rounded-[40px] shadow-[0_25px_50px_-12px_rgba(255,107,53,0.15)] border border-orange-100 overflow-hidden flex flex-col h-[850px] relative">

                <div className="p-6 pb-4 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-orange-200 shadow-sm">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-full h-full rounded-full bg-white border-2 border-white" alt="Avatar" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">王志远</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">最后更新: 刚刚</span>
                                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">资料完整度 80%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-4 scrollbar-hide pb-6">

                    <div className="bg-blue-50/50 rounded-[24px] p-4 border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">AI 客户画像生成</span>
                            <button className="text-blue-300 hover:text-blue-500"><i className="fa-solid fa-rotate-right text-xs"></i></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-white text-blue-800 text-xs font-medium border border-blue-100 shadow-sm rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                现金流敏感型
                            </span>
                            <span className="px-3 py-1.5 bg-white text-blue-800 text-xs font-medium border border-blue-100 shadow-sm rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                家庭经济支柱
                            </span>
                            <span className="px-3 py-1.5 bg-white text-blue-800 text-xs font-medium border border-blue-100 shadow-sm rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                互联网高管
                            </span>
                            <span className="px-3 py-1.5 bg-white text-blue-800 text-xs font-medium border border-blue-100 shadow-sm opacity-70 rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                亚健康
                            </span>
                        </div>
                    </div>

                    <div className="bg-orange-50/30 rounded-[24px] p-4 border border-orange-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">识别到的需求点</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium border border-orange-100 shadow-sm rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                <i className="fa-solid fa-arrow-trend-down text-orange-400 mr-1"></i>降低当前保费压力
                            </span>
                            <span className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium border border-orange-100 shadow-sm rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                <i className="fa-solid fa-child text-orange-400 mr-1"></i>子女教育金储备
                            </span>
                            <span className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium border border-orange-100 shadow-sm rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl hover:scale-105 transition-transform">
                                隐私保护
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] border border-gray-200 p-0 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">家庭图谱 & 配置</span>
                            <button className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-orange-500 hover:border-orange-200 text-xs">
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <div className="p-2 space-y-2">

                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 group">
                                <div className="flex items-center gap-3">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-8 h-8 rounded-full bg-gray-100" alt="Avatar" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-700">本人 (王志远)</p>
                                        <p className="text-[10px] text-gray-400">42岁 · 已投保</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-gear text-gray-300 group-hover:text-gray-500 text-xs mr-2"></i>
                            </div>

                            <div className="flex flex-col p-2 rounded-xl border border-orange-200 cursor-pointer bg-[#FFF5F0]">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wife" className="w-8 h-8 rounded-full bg-orange-100" alt="Avatar" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">配偶 (张女士)</p>
                                            <p className="text-[10px] text-orange-500">正在配置...</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-orange-500 font-bold bg-white px-2 py-1 rounded-md shadow-sm border border-orange-100">保存</button>
                                </div>

                                <div className="bg-white/50 rounded-lg p-2 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">出生年份</label>
                                        <select className="w-full text-xs bg-white border border-orange-100 rounded-md py-1 px-1 text-gray-700 focus:outline-none focus:border-orange-300">
                                            <option>1985年</option>
                                            <option>1986年</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">职业类别</label>
                                        <select className="w-full text-xs bg-white border border-orange-100 rounded-md py-1 px-1 text-gray-700 focus:outline-none focus:border-orange-300">
                                            <option>1类 (内勤)</option>
                                            <option>2类</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] text-gray-400 block mb-1">健康备注 (AI生成)</label>
                                        <div className="flex flex-wrap gap-1">
                                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500">体检正常</span>
                                            <span className="px-2 py-0.5 border border-dashed border-gray-300 rounded text-[10px] text-gray-400 hover:text-orange-500 hover:border-orange-300 cursor-pointer">
                                                + 添加标签
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 group">
                                <div className="flex items-center gap-3">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kid" className="w-8 h-8 rounded-full bg-blue-50" alt="Avatar" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-700">长子 (10岁)</p>
                                        <p className="text-[10px] text-gray-400">未配置保险</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-gear text-gray-300 group-hover:text-gray-500 text-xs mr-2"></i>
                            </div>

                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-[24px] p-4 shadow-md flex justify-between items-center">
                        <div>
                            <div className="text-[10px] text-gray-300 mb-0.5">当前推荐</div>
                            <div className="font-bold text-sm">无忧人生定期版组合</div>
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                        </button>
                    </div>

                    <div className="h-2"></div>
                </div>

            </div>
        </div>
    );
};

export default OptimizedCustomerCard;
