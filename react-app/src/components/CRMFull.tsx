
import React from 'react';

const CRMFull: React.FC = () => {
    return (
        <div className="h-screen w-full flex overflow-hidden text-[#4A3B32] font-['Noto_Sans_SC'] bg-[#FFF5F0]">

            <main className="flex-1 flex flex-col h-full relative">

                {/* Header */}
                <header className="h-20 flex items-center px-8 border-b border-orange-100 bg-white/60 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <i className="fa-solid fa-robot text-xl"></i>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-800">金牌助理 Jarvis</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-xs text-gray-500 font-medium">在线 | 已读取客户画像</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-orange-200" id="chat-container">

                    <div className="flex justify-center">
                        <span className="bg-orange-50 text-orange-400 text-xs px-4 py-1 rounded-full font-medium">今天 14:30</span>
                    </div>

                    <div className="flex gap-4 items-start max-w-[85%]">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md">
                            AI
                        </div>
                        <div className="bg-white/85 backdrop-blur-md border border-white/60 p-4 rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-sm text-sm leading-relaxed">
                            王总这边的家庭结构比较清晰了。根据刚才的沟通，他主要担心的是自己作为家庭经济支柱的健康风险。我们是不是先从<span className="text-orange-600 font-bold">重疾险</span>的配置入手？
                        </div>
                    </div>

                    <div className="flex gap-4 items-start max-w-[85%]">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md">
                            AI
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="bg-white/85 backdrop-blur-md border border-white/60 p-4 rounded-tl-lg rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-sm text-sm">
                                为了精准计算保额，我们需要确认一下王总的年收入范围大概是多少？
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button className="rounded-full px-5 py-2 bg-white border border-orange-200 text-orange-600 text-sm hover:bg-orange-50 transition-colors">30-50万</button>
                                <button className="rounded-full px-5 py-2 bg-orange-100 border border-orange-300 text-orange-700 text-sm font-bold shadow-sm ring-2 ring-orange-200 ring-offset-1">50-100万</button>
                                <button className="rounded-full px-5 py-2 bg-white border border-orange-200 text-orange-600 text-sm hover:bg-orange-50 transition-colors">100万以上</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse gap-4 items-start self-end max-w-[85%] ml-auto">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-gray-100 flex-shrink-0" alt="User" />
                        <div className="bg-gray-800 text-white p-4 rounded-tr-lg rounded-tl-3xl rounded-bl-3xl rounded-br-3xl shadow-[0_10px_30px_-10px_rgba(255,107,53,0.15)] text-sm">
                            对，他是企业高管，年收入在80万左右，但他经常加班熬夜，体检有轻度脂肪肝。
                        </div>
                    </div>

                    <div className="flex gap-4 items-start max-w-[90%]">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md">
                            AI
                        </div>
                        <div className="w-full">
                            <div className="bg-white/85 backdrop-blur-md border border-white/60 p-5 rounded-[24px] shadow-[0_10px_30px_-10px_rgba(255,107,53,0.15)] border-l-4 border-orange-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-md mb-1 inline-block">高净值尊享版</span>
                                        <h3 className="text-lg font-bold text-gray-800">无忧人生·重疾守护计划 A</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">预估保费</p>
                                        <p className="text-xl font-bold text-orange-600">¥18,500<span className="text-sm font-normal text-gray-500">/年</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-orange-50/50 p-3 rounded-2xl flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm">
                                            <i className="fa-solid fa-shield-heart"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">重疾保额</p>
                                            <p className="font-bold text-gray-700">100万</p>
                                        </div>
                                    </div>
                                    <div className="bg-orange-50/50 p-3 rounded-2xl flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm">
                                            <i className="fa-solid fa-hospital-user"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">绿色通道</p>
                                            <p className="font-bold text-gray-700">协和/华西</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 p-3 rounded-xl mb-4 text-xs text-gray-600 border border-orange-100 leading-relaxed">
                                    <span className="text-orange-500 font-bold"><i className="fa-solid fa-lightbulb"></i> 推荐理由：</span>
                                    针对客户<span className="font-bold text-gray-800">轻度脂肪肝</span>的情况，该产品核保宽松，且包含<span className="font-bold text-gray-800">心脑血管二次赔付</span>，非常适合高压工作人群。
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] text-white py-2.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                        <i className="fa-solid fa-wand-magic-sparkles"></i> 生成计划书 PDF
                                    </button>
                                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-50">
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-32"></div>
                </div>

                {/* Footer Input */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FFF5F0] via-[#FFF5F0] to-transparent pt-10 pb-6 px-6 z-20">
                    <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
                        <button className="flex-shrink-0 bg-white border border-orange-200 text-orange-600 px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:bg-orange-50 transition-all">
                            <i className="fa-regular fa-comment-dots"></i> 询问是否有家族病史
                        </button>
                        <button className="flex-shrink-0 bg-white border border-orange-200 text-orange-600 px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:bg-orange-50 transition-all">
                            <i className="fa-solid fa-child-reaching"></i> 添加子女教育金规划
                        </button>
                        <button className="flex-shrink-0 bg-white border border-orange-200 text-orange-600 px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 hover:bg-orange-50 transition-all">
                            <i className="fa-solid fa-calculator"></i> 重新计算保费
                        </button>
                    </div>

                    <div className="bg-white p-2 rounded-[30px] shadow-lg border border-orange-100 flex items-center gap-2">
                        <button className="w-10 h-10 bg-gray-50 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors">
                            <i className="fa-solid fa-microphone"></i>
                        </button>
                        <input type="text" placeholder="输入客户反馈或指令..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 h-10 px-2" />
                        <button className="w-12 h-10 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] rounded-full text-white shadow-md hover:opacity-90 transition-opacity flex items-center justify-center">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </main>

            {/* Sidebar (Desktop only) */}
            <aside className="w-[400px] h-full bg-white border-l border-orange-100 p-6 flex flex-col shadow-xl z-20 hidden md:flex">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">Customer Profile</h2>

                <div className="bg-orange-50/50 rounded-[30px] p-5 mb-4 border border-orange-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-200/20 rounded-full blur-xl group-hover:bg-orange-300/30 transition-all"></div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full p-1 bg-white shadow-sm">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-full h-full rounded-full" alt="Client" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">王志远 <span className="text-xs font-normal text-white bg-orange-400 px-2 py-0.5 rounded-full ml-1">高意向</span></h3>
                            <p className="text-xs text-gray-500 mt-1"><i className="fa-solid fa-briefcase mr-1"></i>科技公司 CTO (42岁)</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">已婚育</span>
                        <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">年收80w+</span>
                        <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">北京海淀</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-800 mb-3 ml-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 风险因素
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs flex items-center gap-1.5">
                            <i className="fa-solid fa-wine-glass"></i> 经常应酬
                        </div>
                        <div className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs flex items-center gap-1.5">
                            <i className="fa-solid fa-notes-medical"></i> 轻度脂肪肝
                        </div>
                        <div className="px-3 py-1.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-full text-xs flex items-center gap-1.5 opacity-60">
                            <i className="fa-solid fa-smoking"></i> 吸烟史(待确认)
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                    <h3 className="text-xs font-bold text-gray-800 mb-3 ml-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> 推荐保险组合
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 border border-orange-200 bg-white rounded-2xl shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg">
                                <i className="fa-solid fa-heart-pulse"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-700">终身重疾险</p>
                                <p className="text-xs text-gray-400">优先配置 50-100万</p>
                            </div>
                            <i className="fa-solid fa-check-circle text-orange-500"></i>
                        </div>
                        <div className="p-3 border border-gray-100 bg-gray-50 rounded-2xl flex items-center gap-3 opacity-70">
                            <div className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center text-lg shadow-sm">
                                <i className="fa-solid fa-user-doctor"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-600">高端医疗险</p>
                                <p className="text-xs text-gray-400">建议补充 (Msh/Bupa)</p>
                            </div>
                            <i className="fa-regular fa-circle text-gray-300"></i>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xs font-bold text-gray-800 mb-3 ml-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> 方案记录
                        </h3>
                        <div className="bg-gray-50 rounded-2xl p-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 pb-2 border-b border-gray-200">
                                <span>2023.10.24 10:00</span>
                                <span className="text-orange-500 cursor-pointer">查看 {'>'}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-snug">生成了《王总家庭全方位保障计划书V1》，侧重子女教育与自身重疾。</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full py-3 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                        <i className="fa-solid fa-plus"></i> 添加新的家庭成员
                    </button>
                </div>

            </aside>
        </div>
    );
};

export default CRMFull;
