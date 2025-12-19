import React, { useState } from 'react';

const DigitalHumanTrainingWorkshop: React.FC = () => {
    const [expertTab, setExpertTab] = useState<'custom' | 'market'>('custom');
    const [mimicryLevel, setMimicryLevel] = useState(70);
    const [selectedExpertId, setSelectedExpertId] = useState('expert1');
    const [isMeInputVisible, setIsMeInputVisible] = useState(false);
    const [isExpertInputVisible, setIsExpertInputVisible] = useState(false);

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] font-sans relative w-full">
            <style>{`
                .fusion-stage {
                    background: radial-gradient(circle at center, #FFF7ED 0%, #FFFFFF 70%);
                }
                .flow-dot {
                    width: 5px;
                    height: 5px;
                    background: #E5E7EB;
                    border-radius: 50%;
                    animation: flow 1.5s infinite;
                }
                .flow-dot:nth-child(2) { animation-delay: 0.2s; }
                .flow-dot:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes flow {
                    0% { opacity: 0.3; transform: scale(1); background: #E5E7EB; }
                    50% { opacity: 1; transform: scale(1.5); background: #FF6B35; }
                    100% { opacity: 0.3; transform: scale(1); background: #E5E7EB; }
                }

                .config-card {
                    background: #FFFFFF;
                    border-radius: 16px;
                    border: 1px solid #E5E7EB;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    overflow: hidden;
                    transition: all 0.2s;
                }
                .config-card.active {
                    border-color: #FFDCC2;
                    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.08);
                }

                .avatar-ring {
                    padding: 3px;
                    transition: all 0.3s;
                }
                .ring-me {
                    background: #E5E7EB;
                    border: 1px solid #D1D5DB;
                }
                .ring-expert {
                    background: linear-gradient(135deg, #FF6B35, #FF9F43);
                    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.25);
                }
                
                .tag-req {
                    font-size: 10px;
                    background: #1F2937;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: bold;
                }
                .tag-opt {
                    font-size: 10px;
                    background: #F3F4F6;
                    color: #6B7280;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: bold;
                }
                
                @keyframes expand {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            {/* Header / Fusion Stage */}
            <div className="fusion-stage sticky top-0 z-10 py-6 flex justify-center items-center gap-3 border-b border-gray-100">
                <div className="flex flex-col items-center gap-2">
                    <div className="avatar-ring ring-expert w-16 h-16 rounded-full flex items-center justify-center bg-white relative">
                        <img
                            src={expertTab === 'market'
                                ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Expert1"
                                : "https://api.dicebear.com/7.x/avataaars/svg?seed=CustomUpload"}
                            className="w-full h-full rounded-full object-cover"
                            alt="Expert"
                        />
                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-[10px] shadow-sm">
                            <i className="fa-solid fa-crown"></i>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">模仿对象</span>
                </div>

                <div className="flex gap-1 items-center px-1">
                    <div className="flow-dot"></div>
                    <div className="flow-dot"></div>
                    <div className="flow-dot"></div>
                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs ml-1"></i>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="avatar-ring ring-me w-16 h-16 rounded-full p-1 bg-white">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyAgent"
                            className="w-full h-full rounded-full bg-gray-100"
                            alt="Me"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">我的基底</span>
                </div>
            </div>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-64 no-scrollbar">

                {/* Me (Base Model) Card */}
                <div className="config-card active">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">我 (基底模型)</h3>
                            </div>
                        </div>
                        <span className="tag-req">必选</span>
                    </div>

                    <div className="p-4">
                        {!isMeInputVisible ? (
                            <>
                                <p className="text-[11px] text-gray-400 mb-3">完善您的基础资料，让 AI 拥有您的身份与声音：</p>
                                <div className="grid grid-cols-3 gap-2 animate-[fadeIn_0.3s_ease-out]">
                                    <button className="flex flex-col items-center justify-center gap-1.5 h-[70px] bg-orange-50 border border-orange-200 rounded-xl relative overflow-hidden group transition-all">
                                        <i className="fa-solid fa-microphone-lines text-orange-500 text-lg"></i>
                                        <span className="text-[10px] font-bold text-orange-600">声纹已录</span>
                                        <div className="absolute top-1 right-1 text-green-500">
                                            <i className="fa-solid fa-check-circle text-[10px]"></i>
                                        </div>
                                    </button>

                                    <button className="flex flex-col items-center justify-center gap-1.5 h-[70px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl text-gray-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all">
                                        <i className="fa-solid fa-file-pdf text-lg"></i>
                                        <span className="text-[10px] font-medium">传履历/案例</span>
                                    </button>

                                    <button
                                        onClick={() => setIsMeInputVisible(true)}
                                        className="flex flex-col items-center justify-center gap-1.5 h-[70px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl text-gray-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all"
                                    >
                                        <i className="fa-solid fa-keyboard text-lg"></i>
                                        <span className="text-[10px] font-medium">贴个人简介</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="animate-[expand_0.2s_ease-out]">
                                <div className="bg-white border-2 border-orange-500 rounded-xl p-3 mb-3 shadow-sm">
                                    <textarea
                                        autoFocus
                                        className="w-full h-32 text-xs text-gray-800 outline-none resize-none placeholder-gray-400 leading-relaxed"
                                        placeholder="请在此处直接粘贴您的个人简介、过往业绩描述，或者直接输入一段您的自我介绍..."
                                    ></textarea>
                                    <div className="text-right text-[10px] text-gray-300 mt-1">0/500</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsMeInputVisible(false)}
                                        className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={() => setIsMeInputVisible(false)}
                                        className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold shadow-md hover:bg-orange-600"
                                    >
                                        确认保存
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Imitation Object (Expert) Card */}
                <div className="config-card active border-orange-200 shadow-md">
                    <div className="p-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-transparent flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">模仿对象 (导师)</h3>
                            </div>
                        </div>
                        <span className="tag-opt">可选</span>
                    </div>

                    <div className="px-4 pt-3">
                        <div className="bg-gray-100 p-1 rounded-lg flex">
                            <button
                                onClick={() => setExpertTab('custom')}
                                className={`flex-1 text-center py-2 text-[11px] font-bold rounded-lg transition-all ${expertTab === 'custom' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
                            >
                                <i className="fa-solid fa-cloud-arrow-up mr-1"></i>自定义上传
                            </button>
                            <button
                                onClick={() => setExpertTab('market')}
                                className={`flex-1 text-center py-2 text-[11px] font-bold rounded-lg transition-all ${expertTab === 'market' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
                            >
                                <i className="fa-solid fa-store mr-1"></i>专家市场
                            </button>
                        </div>
                    </div>

                    {expertTab === 'custom' ? (
                        <div className="p-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                            {!isExpertInputVisible ? (
                                <>
                                    <p className="text-[11px] text-gray-400 mb-3">上传您崇拜的销冠资料，生成专属导师模型：</p>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button className="flex flex-col items-center justify-center gap-1.5 h-[70px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl text-gray-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all">
                                            <i className="fa-solid fa-microphone text-gray-400 text-lg"></i>
                                            <span className="text-[10px] font-medium">传销冠录音</span>
                                        </button>

                                        <button className="flex flex-col items-center justify-center gap-1.5 h-[70px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl text-gray-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all">
                                            <i className="fa-solid fa-file-word text-gray-400 text-lg"></i>
                                            <span className="text-[10px] font-medium">传金牌话术</span>
                                        </button>

                                        <button
                                            onClick={() => setIsExpertInputVisible(true)}
                                            className="flex flex-col items-center justify-center gap-1.5 h-[70px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl text-gray-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all"
                                        >
                                            <i className="fa-solid fa-paste text-gray-400 text-lg"></i>
                                            <span className="text-[10px] font-medium">贴聊天记录</span>
                                        </button>
                                    </div>

                                    <div className="mt-3 bg-blue-50 p-2 rounded-lg flex gap-2 items-start">
                                        <i className="fa-solid fa-circle-info text-blue-500 text-[10px] mt-0.5"></i>
                                        <p className="text-[10px] text-blue-600 leading-tight">上传后，系统将自动提取对方的语言逻辑、常用词汇与应对策略。</p>
                                    </div>
                                </>
                            ) : (
                                <div className="animate-[expand_0.2s_ease-out] bg-orange-50/30 rounded-xl">
                                    <div className="bg-white border-2 border-orange-500 rounded-xl p-3 mb-3 shadow-sm">
                                        <textarea
                                            autoFocus
                                            className="w-full h-40 text-xs text-gray-800 outline-none resize-none bg-transparent placeholder-gray-400 leading-relaxed"
                                            placeholder="在此粘贴金牌销售的对话记录、话术脚本、或者公众号文章内容...&#10;&#10;AI 将自动提取其中的语言风格与逻辑。"
                                        ></textarea>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-orange-100/50">
                                            <button className="text-gray-400 hover:text-orange-500"><i className="fa-solid fa-microphone"></i></button>
                                            <button className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-full shadow-md">
                                                AI 解析
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsExpertInputVisible(false)}
                                        className="w-full mt-3 text-[10px] text-gray-400 flex items-center justify-center gap-1 hover:text-orange-500"
                                    >
                                        <i className="fa-solid fa-rotate-left"></i> 切换为录音或文件上传
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                            <label
                                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all relative ${selectedExpertId === 'expert1' ? 'border-orange-200 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
                                onClick={() => setSelectedExpertId('expert1')}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedExpertId === 'expert1' ? 'border-orange-500 bg-white' : 'border-gray-300 bg-white'}`}>
                                    {selectedExpertId === 'expert1' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                                </div>

                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert1" className="w-10 h-10 rounded-full bg-white border border-orange-100" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-900">MDRT 冠军 · 强攻型</span>
                                        <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded font-bold">Hot</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">逻辑犀利，擅长处理价格异议，逼单能力强。</div>
                                </div>
                            </label>

                            <label
                                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all relative ${selectedExpertId === 'expert2' ? 'border-orange-200 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
                                onClick={() => setSelectedExpertId('expert2')}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedExpertId === 'expert2' ? 'border-orange-500 bg-white' : 'border-gray-300 bg-white'}`}>
                                    {selectedExpertId === 'expert2' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                                </div>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Expert2" className="w-10 h-10 rounded-full bg-white border border-gray-100" />
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-gray-900">亲和力专家 · 顾问型</div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">擅长情感共鸣与长期主义服务。</div>
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-5 py-4 pb-8 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="mb-5">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-600">模仿强度 (Mimicry)</span>
                        <span className="text-sm font-black text-orange-500">{mimicryLevel}%</span>
                    </div>

                    <div className="relative h-6 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={mimicryLevel}
                            onChange={(e) => setMimicryLevel(parseInt(e.target.value))}
                            className="absolute w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer z-20 opacity-0"
                        />
                        <div className="w-full h-1.5 bg-gray-200 rounded-full absolute top-1/2 -translate-y-1/2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-gray-400 to-orange-500" style={{ width: `${mimicryLevel}%` }}></div>
                        </div>
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-orange-500 rounded-full shadow-md flex items-center justify-center pointer-events-none z-10 transition-all"
                            style={{ left: `calc(${mimicryLevel}% - 10px)` }}
                        >
                            <i className="fa-solid fa-left-right text-[8px] text-orange-500"></i>
                        </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>保持本色</span>
                        <span>完全复刻</span>
                    </div>
                </div>

                <button className="w-full bg-gray-900 text-white rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                    <i className="fa-solid fa-bolt text-orange-400 animate-pulse"></i>
                    <span className="font-bold text-sm">开始融合训练</span>
                </button>
            </footer>
            <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
             @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            `}</style>
        </div>
    );
};

export default DigitalHumanTrainingWorkshop;
