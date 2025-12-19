import React, { useState } from 'react';

const AgentTrainingWorkshop: React.FC = () => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [activeStyle, setActiveStyle] = useState('顾问式专业');
    const [sliderValue, setSliderValue] = useState(60);

    const styles = ['顾问式专业', '狼性逼单', '亲和力共情', '数据流理性'];

    return (
        <div className="h-full flex flex-col bg-[#F9FAFB] overflow-y-auto no-scrollbar pb-24">
            {/* Header Area */}
            <div className="bg-[radial-gradient(circle_at_top,_#FFF7ED_0%,_#FFFFFF_70%)] border-b border-gray-100 px-5 pt-4 pb-6 flex items-center justify-between">
                <div className="flex-1 text-center">
                    <h1 className="text-base font-bold text-gray-900">分身定向特训</h1>
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        模型准备就绪
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-orange-50">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyAgent" className="w-full h-full" alt="Agent" />
                </div>
            </div>

            <main className="px-4 py-5 space-y-6">
                {/* Step 1: Target Customer */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 1</span>
                            <h2 className="font-bold text-gray-800 text-sm">谁是目标客户？</h2>
                        </div>
                        <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded">AI 自动提取画像</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-3 mb-3 shadow-sm focus-within:border-orange-500 focus-within:shadow-[0_4px_12px_rgba(255,107,53,0.1)] transition-all">
                        <textarea
                            className="w-full h-20 text-xs text-gray-800 bg-transparent outline-none resize-none placeholder-gray-400 leading-relaxed"
                            placeholder="在此输入客户背景信息、复制微信聊天记录，或上传需求文档..."
                        ></textarea>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
                                    <i className="fa-solid fa-microphone"></i>
                                </button>
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
                                    <i className="fa-solid fa-paperclip"></i>
                                </button>
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
                                    <i className="fa-solid fa-image"></i>
                                </button>
                            </div>
                            <span className="text-[10px] text-gray-300">0/500</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setPreviewVisible(true)}
                        className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-gray-800 to-black text-white shadow-lg active:scale-[0.98] transition-all"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles text-orange-400"></i>
                        AI 智能分析并生成画像
                    </button>

                    {previewVisible && (
                        <div className="bg-white rounded-2xl border border-orange-100 p-3 shadow-[0_4px_15px_rgba(255,107,53,0.08)] animate-[slideUp_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold">王</div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-900 text-sm">王志远</h3>
                                        <span className="text-[10px] text-gray-400">预算 5-8万</span>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        <span className="text-[9px] bg-gray-100 px-1.5 rounded text-gray-500">CTO</span>
                                        <span className="text-[9px] bg-gray-100 px-1.5 rounded text-gray-500">已婚育</span>
                                    </div>
                                </div>
                                <i className="fa-solid fa-check-circle text-green-500 text-lg"></i>
                            </div>
                        </div>
                    )}
                </section>

                <div className="w-full h-px bg-gray-100"></div>

                {/* Step 2: Sales Strategy */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 2</span>
                        <h2 className="font-bold text-gray-800 text-sm">如何搞定他？(投喂资料)</h2>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm focus-within:border-orange-500 transition-all">
                        <textarea
                            className="w-full h-16 text-xs text-gray-800 bg-transparent outline-none resize-none placeholder-gray-400 leading-relaxed"
                            placeholder="输入您想使用的销售策略、话术要点，或者上传金牌话术文档..."
                        ></textarea>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-500 text-[10px] font-bold">
                                    <i className="fa-solid fa-microphone"></i> 录制示范语气
                                </button>
                                <button className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400">
                                    <i className="fa-solid fa-file-pdf"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3: Character Adjustment */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 3</span>
                        <h2 className="font-bold text-gray-800 text-sm">AI 性格调校</h2>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="mb-4">
                            <p className="text-[10px] text-gray-400 mb-2">选择基础基调</p>
                            <div className="flex flex-wrap gap-2">
                                {styles.map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setActiveStyle(style)}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${activeStyle === style
                                            ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-orange-200'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] text-gray-400">个人风格浓度</p>
                                <span className="text-xs font-bold text-orange-600">{sliderValue}%</span>
                            </div>
                            <div className="relative h-6 flex items-center group">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sliderValue}
                                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                                <span>🤖 照本宣科</span>
                                <span>😎 惟妙惟肖</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-[70px] left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 px-5 py-3 flex gap-3 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                <button className="flex-[1] bg-white border border-gray-200 text-gray-600 rounded-xl h-11 text-xs font-bold active:bg-gray-50 transition-colors">
                    保存模板
                </button>
                <button className="flex-[2] bg-gray-900 text-white rounded-xl h-11 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                    <i className="fa-solid fa-play text-xs text-green-400"></i>
                    <span className="font-bold text-sm">生成分身并演练</span>
                </button>
            </footer>
        </div>
    );
};

export default AgentTrainingWorkshop;
