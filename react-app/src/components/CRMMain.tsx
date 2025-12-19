
import React from 'react';

const CRMMain: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col text-[#5C4B41] bg-[#F7F5F2] font-['Noto_Sans_SC']">
            {/* Header */}
            <header className="px-5 py-4 bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-[#EAE0D5]">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-xl font-bold text-[#5C4B41]">客户档案库 <span className="text-xs font-normal text-gray-400 bg-[#F7F5F2] px-2 py-0.5 rounded-full">42人</span></h1>
                    <button className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>

                <div className="h-10 bg-[#F7F5F2] rounded-xl flex items-center px-3 border border-transparent focus-within:border-orange-200 focus-within:bg-white transition-all">
                    <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-2"></i>
                    <input type="text" placeholder="搜索客户姓名、保单状态..."
                        className="bg-transparent text-sm outline-none flex-1 text-[#5C4B41] placeholder-gray-400" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">

                <div className="bg-white rounded-[20px] shadow-[0_10px_25px_-5px_rgba(255,107,53,0.15)] border border-[#FFDCC2] overflow-hidden active transition-all">
                    <div className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-white border border-orange-100 flex items-center justify-center text-2xl shadow-sm">
                                        👨‍💼
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        王志远
                                        <span className="text-[10px] text-white bg-orange-500 px-1.5 py-0.5 rounded-md shadow-sm">重点跟进</span>
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-gray-500 bg-[#F7F5F2] px-1.5 rounded">企业高管</span>
                                        <span className="text-[10px] text-gray-500 bg-[#F7F5F2] px-1.5 rounded">年预算8W</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">HOT</span>
                                <div className="flex gap-0.5">
                                    <div className="w-1.5 h-4 bg-[#FF6B35] rounded-sm"></div>
                                    <div className="w-1.5 h-4 bg-[#FF6B35] rounded-sm"></div>
                                    <div className="w-1.5 h-4 bg-[#FF6B35] rounded-sm"></div>
                                    <div className="w-1.5 h-4 bg-[#EAE0D5] rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#FDFBF7] border-t border-[#EAE0D5] p-4">

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF8850] to-[#FF6B35] text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-orange-100 active:scale-95 transition-transform">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                AI 智能生成方案
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white border border-[#EAE0D5] text-[#5C4B41] py-3 rounded-xl text-xs font-bold shadow-sm active:bg-gray-50 transition-colors">
                                <i className="fa-solid fa-comment-dots"></i>
                                开启新会话
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1 px-1">
                                <span className="text-[10px] text-[#9A897D] font-bold uppercase tracking-wider">AI 作业记录</span>
                                <span className="text-[10px] text-orange-500 cursor-pointer">展开全部</span>
                            </div>

                            <div className="bg-white border border-white hover:border-orange-200 rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                        <i className="fa-solid fa-file-invoice"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors">重疾险对比方案 V1</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">针对脂肪肝核保与定期险...</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-gray-300">14:30</span>
                                    <span className="text-[9px] bg-green-50 text-green-600 px-1.5 rounded border border-green-100">已生成</span>
                                </div>
                            </div>

                            <div className="bg-white border border-white hover:border-orange-200 rounded-xl p-3 flex items-center justify-between cursor-pointer shadow-sm group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] text-gray-500 flex items-center justify-center text-sm group-hover:bg-[#5C4B41] group-hover:text-white transition-colors">
                                        <i className="fa-solid fa-microphone-lines"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#5C4B41] transition-colors">异议处理：嫌保费贵</h4>
                                        <p className="text-[10px] text-gray-400 mt-0.5">生成了3条降维打击话术...</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-300">昨天</span>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all">
                    <div className="p-5 flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
                                👩‍🏫
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-700">李老师</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">上次作业：5天前</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-[#F7F5F2] text-[#8C7364] rounded-lg text-xs font-bold hover:bg-orange-50 hover:text-orange-500 transition-colors">
                            进入作业
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all">
                    <div className="p-5 flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
                                👷
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-700">张工</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">上次作业：1周前</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-[#F7F5F2] text-[#8C7364] rounded-lg text-xs font-bold hover:bg-orange-50 hover:text-orange-500 transition-colors">
                            进入作业
                        </button>
                    </div>
                </div>

            </main>

            {/* Navigation */}
            <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-[#EAE0D5] h-16 flex justify-around items-center z-30 pb-2">
                <div className="flex flex-col items-center gap-1 text-[#FF6B35]">
                    <i className="fa-solid fa-folder-open text-xl"></i>
                    <span className="text-[10px] font-bold">客户档案</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#C4B5AD]">
                    <i className="fa-solid fa-bolt text-xl"></i>
                    <span className="text-[10px] font-bold">技能中心</span>
                </div>
            </nav>

        </div>
    );
};

export default CRMMain;
