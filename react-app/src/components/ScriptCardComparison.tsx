
import React from 'react';

const ScriptCardComparison: React.FC = () => {
    return (
        <div className="h-screen w-full flex overflow-hidden text-[#4A3B32] font-['Noto_Sans_SC'] bg-[#FFF5F0]">

            <main className="flex-1 flex flex-col h-full relative">

                <header className="h-16 flex items-center px-6 border-b border-orange-100 bg-white/70 backdrop-blur-md z-10 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-md">
                            <i className="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-sm">金牌助理 Jarvis</h1>
                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">在线</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8" id="chat-container">

                    <div className="flex flex-row-reverse gap-3 items-start max-w-[85%] ml-auto">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-full border border-white shadow-sm bg-gray-100 flex-shrink-0 mt-1" />
                        <div className="bg-gray-800 text-white p-3.5 rounded-tr-none rounded-tl-3xl rounded-bl-3xl rounded-br-3xl shadow-[0_8px_20px_-8px_rgba(255,107,53,0.2)] text-sm">
                            这几年经济环境不好，我对每年拿出2万块还是有点压力的，有没有性价比更高的？
                        </div>
                    </div>

                    <div className="flex gap-3 items-start max-w-[95%]">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] mt-1">
                            AI
                        </div>

                        <div className="flex flex-col gap-3 w-full">

                            <div className="bg-white/90 backdrop-blur-md border border-white/60 p-4 rounded-tl-none rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-sm text-sm w-fit">
                                理解王总的顾虑。针对这种情况，我们可以调整策略，通过<span className="text-orange-600 font-bold">“定期重疾 + 终身寿险”</span>的组合来降低当期保费压力。
                            </div>

                            <div className="bg-gradient-to-b from-[#FFFAF5] to-white border border-[#FFDCC2] relative overflow-hidden rounded-r-3xl rounded-bl-3xl shadow-md p-4 w-full md:w-[90%] before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#FF6B35]">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-orange-100 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                        <i className="fa-solid fa-lightbulb"></i>
                                    </span>
                                    <span className="font-bold text-gray-800 text-sm">推荐策略：降维打击法</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-[10px] bg-white border border-orange-200 text-gray-500 px-2 py-1 rounded-md">
                                        <i className="fa-solid fa-check text-orange-500 mr-1"></i>保留高保额
                                    </span>
                                    <span className="text-[10px] bg-white border border-orange-200 text-gray-500 px-2 py-1 rounded-md">
                                        <i className="fa-solid fa-check text-orange-500 mr-1"></i>缩短缴费期
                                    </span>
                                    <span className="text-[10px] bg-white border border-orange-200 text-gray-500 px-2 py-1 rounded-md">
                                        <i className="fa-solid fa-check text-orange-500 mr-1"></i>强调现金流
                                    </span>
                                </div>

                                <div className="bg-white p-3 rounded-xl border-l-4 border-orange-300 relative">
                                    <i className="fa-solid fa-quote-left absolute top-2 left-2 text-gray-100 text-2xl -z-10"></i>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                        “王总，其实很多精算师自己买保险也是这个思路。我们先把这100万的保障做足，用<span className="text-orange-600">‘定期消费型’</span>把现在的杠杆拉到最高，每年只要6000多。等过几年经济环境好了，我们再补充终身型。这样既不占用您现在的现金流，保障也一分不少。”
                                    </p>
                                    <button className="absolute bottom-2 right-2 text-gray-300 hover:text-orange-500 transition-colors">
                                        <i className="fa-regular fa-copy"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-1">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-gray-600 rounded-full text-xs hover:border-orange-400 hover:text-orange-600 transition-all shadow-sm group">
                                    <div className="w-5 h-5 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                        <i className="fa-solid fa-share-nodes"></i>
                                    </div>
                                    发送“低保费高保障”理赔案例
                                </button>

                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-gray-600 rounded-full text-xs hover:border-orange-400 hover:text-orange-600 transition-all shadow-sm group">
                                    <div className="w-5 h-5 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <i className="fa-solid fa-scale-balanced"></i>
                                    </div>
                                    生成新旧方案对比表
                                </button>

                                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full text-xs shadow-md hover:shadow-lg transition-all">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    立即生成计划书
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="h-32"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FFF5F0] via-[#FFF5F0] to-transparent pt-12 pb-6 px-6 z-20">
                    <div className="flex gap-2 mb-2 pl-1">
                        <button className="text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded border border-gray-200 hover:text-orange-500">
                            想问：定期重疾和终身的区别？
                        </button>
                        <button className="text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded border border-gray-200 hover:text-orange-500">
                            想问：现金价值怎么算？
                        </button>
                    </div>
                    <div className="bg-white p-2 rounded-[30px] shadow-lg border border-orange-100 flex items-center gap-2">
                        <button className="w-10 h-10 bg-gray-50 rounded-full text-gray-400 hover:text-orange-500"><i className="fa-solid fa-plus"></i></button>
                        <input type="text" placeholder="输入客户反馈..." className="flex-1 bg-transparent border-none outline-none text-sm h-10 px-2" />
                        <button className="w-12 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full text-white shadow-md"><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </main>

            {/* Sidebar */}
            <aside className="w-[360px] bg-white border-l border-orange-100 hidden md:flex flex-col p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase mb-4">当前推荐方案</h2>

                <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-3xl p-5 mb-4 relative overflow-hidden">
                    <i className="fa-solid fa-shield-cat absolute -right-4 -bottom-4 text-8xl text-orange-100 opacity-50"></i>
                    <h3 className="font-bold text-gray-800 text-lg">无忧人生·定期版</h3>
                    <p className="text-xs text-gray-500 mb-4">针对预算敏感型优化</p>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm border-b border-orange-100 pb-2">
                            <span className="text-gray-500">保额</span>
                            <span className="font-bold text-gray-800">100万</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-orange-100 pb-2">
                            <span className="text-gray-500">保障期</span>
                            <span className="font-bold text-gray-800">至70岁</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">年缴</span>
                            <span className="font-bold text-orange-600 text-lg">¥6,240</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-chart-line text-blue-500"></i>
                        <span className="text-xs font-bold text-gray-700">方案优化效果</span>
                    </div>
                    <div className="flex items-end gap-2 h-24 px-2">
                        <div className="w-full bg-gray-200 rounded-t-lg relative group h-[90%]">
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">原方案</span>
                        </div>
                        <div className="w-full bg-orange-400 rounded-t-lg relative group h-[30%]">
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-orange-600 font-bold">新方案</span>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-2">保费降低 65%</p>
                </div>
            </aside>
        </div>
    );
};

export default ScriptCardComparison;
