
import React, { useState } from 'react';
import CustomerProfilePanel from './CustomerProfilePanel';

const CompositeCustomerProfile: React.FC = () => {
    const [isFamilyPopupOpen, setIsFamilyPopupOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start gap-6 overflow-auto font-['Noto_Sans_SC']">

            {/* Left Column: Budget & Stats */}
            <div className="flex flex-col gap-4 w-[400px]">

                <div className="grid grid-cols-2 gap-3">
                    {/* Budget Card */}
                    <div className="bg-[#FFF5F0] rounded-[24px] p-4 flex flex-col justify-between h-32 border border-orange-100 relative overflow-hidden shadow-sm">
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

                    {/* Stacked Profile & Resistance */}
                    <div className="flex flex-col gap-2 h-32">
                        {/* Customer Portrait */}
                        <div className="bg-slate-50 border border-slate-100 rounded-[16px] p-3 flex-1 flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
                                <i className="fa-solid fa-id-card-clip mr-1"></i>客户画像
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[9px] font-medium shadow-sm">
                                    企业高管
                                </span>
                                <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[9px] font-medium shadow-sm">
                                    现金流敏感
                                </span>
                                <span className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[9px] font-medium shadow-sm">
                                    理性决策
                                </span>
                            </div>
                        </div>

                        {/* Resistance Points */}
                        <div className="bg-red-50/50 border border-red-100 rounded-[16px] p-3 flex-1 flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-red-400 uppercase mb-1.5 tracking-wider">
                                <i className="fa-solid fa-shield-virus mr-1"></i>抗拒点
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="px-1.5 py-0.5 bg-white border border-red-100 text-red-500 rounded-full text-[9px] font-medium shadow-sm flex items-center gap-1">
                                    <i className="fa-solid fa-xmark text-[8px]"></i> 嫌保费贵
                                </span>
                                <span className="px-1.5 py-0.5 bg-white border border-red-100 text-red-500 rounded-full text-[9px] font-medium shadow-sm flex items-center gap-1">
                                    <i className="fa-solid fa-xmark text-[8px]"></i> 怕被套牢
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Demand Points Card */}
                <div className="bg-orange-50/30 rounded-[24px] p-4 border border-orange-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
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






            </div>

            <CustomerProfilePanel />

            {/* Family Graph Popup */}
            {isFamilyPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsFamilyPopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-md h-[80vh] bg-white rounded-t-[30px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">家庭成员配置</h3>
                            <button
                                onClick={() => setIsFamilyPopupOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-[#F2F4F6]">
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
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default CompositeCustomerProfile;
