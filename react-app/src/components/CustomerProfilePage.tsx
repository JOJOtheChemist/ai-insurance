
import React, { useState } from 'react';

const CustomerProfilePage: React.FC = () => {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = (id: number) => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const [isFamilyPopupOpen, setIsFamilyPopupOpen] = useState(false);
    const [isSchemePopupOpen, setIsSchemePopupOpen] = useState(false);
    // const schemeScrollRef = useRef<HTMLDivElement>(null);

    const customers = [
        { id: 1, name: '王志远', title: '科技公司 CTO', tag: '重点跟进' },
        { id: 2, name: '李晓雯', title: '中学教师', tag: '潜客' },
        { id: 3, name: '张伟', title: '自由职业', tag: '新导入' },
        { id: 4, name: '陈静', title: '财务主管', tag: '已投保' },
        { id: 5, name: '刘洋', title: '销售总监', tag: '高意向' },
    ];

    return (
        <div className="h-screen w-full flex bg-[#F8F9FA] font-['Noto_Sans_SC']">

            {/* Left Sidebar Directory */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-gray-800">客户目录</h1>
                        <button className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                            type="text"
                            placeholder="搜索客户姓名..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-300 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                    {customers.map((customer) => (
                        <div
                            key={customer.id}
                            className={`p-4 rounded-[20px] cursor-pointer transition-all border ${customer.id === 1 ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${customer.id === 1 ? 'bg-white text-orange-500' : 'bg-gray-100 text-gray-500'}`}>
                                    {customer.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className={`font-bold text-sm truncate ${customer.id === 1 ? 'text-orange-900' : 'text-gray-800'}`}>{customer.name}</h3>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${customer.id === 1 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {customer.tag}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{customer.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-700">业务经理 · 陈小美</p>
                            <p className="text-[10px] text-gray-400">正在查看王志远的档案</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-10 flex justify-center items-start bg-gray-50/50">
                <div className="w-[450px] bg-white border border-orange-100 p-8 flex flex-col shadow-2xl rounded-[32px] min-h-[850px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider pl-1">Detailed Profile</h2>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-colors">
                                <i className="fa-solid fa-share-nodes text-xs"></i>
                            </button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-colors">
                                <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                            </button>
                        </div>
                    </div>

                    {/* Profile Header Card */}
                    <div className="bg-orange-50/50 rounded-[35px] p-6 mb-6 border border-orange-100 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl group-hover:bg-orange-300/30 transition-all"></div>
                        <div className="flex justify-between items-center mb-5 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full p-1.5 bg-white shadow-md">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-full h-full rounded-full" alt="Client" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">王志远</h3>
                                    <p className="text-xs text-gray-500 mt-1.5 font-medium flex items-center gap-2">
                                        <i className="fa-solid fa-briefcase text-orange-400"></i>
                                        科技公司 CTO (42岁)
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] shadow-[0_8px_20px_-4px_rgba(255,166,0,0.15)] border border-[#FFF0E0] p-4 flex flex-col items-center justify-center min-w-[110px]">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <i className="fa-solid fa-wallet text-orange-500 text-xs"></i>
                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">年预算</span>
                                </div>
                                <div className="text-gray-900 leading-none flex items-baseline">
                                    <span className="text-3xl font-black tracking-tighter">5-8</span>
                                    <span className="text-sm font-bold ml-1 text-gray-400">万</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-orange-100/50 pt-4">
                            <p className="text-[11px] font-bold text-orange-400 uppercase mb-3 tracking-widest opacity-80 flex items-center gap-2">
                                <i className="fa-solid fa-address-card"></i> 客户标签
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                <span className="px-4 py-1.5 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-bold shadow-sm">已婚育</span>
                                <span className="px-4 py-1.5 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-bold shadow-sm">年收80w+</span>
                                <span className="px-4 py-1.5 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-bold shadow-sm">北京海淀</span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="mb-8 pl-1">
                        <h3 className="text-xs font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            风险健康因素监测
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                            <div className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
                                <i className="fa-solid fa-wine-glass"></i> 经常应酬
                            </div>
                            <div className="px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
                                <i className="fa-solid fa-notes-medical"></i> 轻度脂肪肝
                            </div>
                            <div className="px-4 py-2 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl text-xs font-bold flex items-center gap-2 opacity-60">
                                <i className="fa-solid fa-smoking"></i> 吸烟史 (待核实)
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-orange-50/50 rounded-[28px] p-5 border border-orange-100 flex flex-col shadow-sm">
                            <span className="text-[11px] font-bold text-orange-400 mb-3 tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-bullseye"></i> 核心需求
                            </span>
                            <div className="flex flex-wrap gap-2 align-content-start">
                                <span className="px-3 py-1.5 bg-white border border-orange-100 text-gray-700 rounded-xl text-[11px] font-bold shadow-sm">保费压力</span>
                                <span className="px-3 py-1.5 bg-white border border-orange-100 text-gray-700 rounded-xl text-[11px] font-bold shadow-sm">子女教育</span>
                                <span className="px-3 py-1.5 bg-white border border-orange-100 text-gray-700 rounded-xl text-[11px] font-bold shadow-sm">隐私保护</span>
                            </div>
                        </div>

                        <div className="bg-red-50/50 rounded-[28px] p-5 border border-red-100 flex flex-col shadow-sm">
                            <span className="text-[11px] font-bold text-red-400 mb-3 tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-shield-virus"></i> 主要抗拒
                            </span>
                            <div className="flex flex-wrap gap-2 align-content-start">
                                <span className="px-3 py-1.5 bg-white border border-red-100 text-red-500 rounded-xl text-[11px] font-bold shadow-sm">觉得太贵</span>
                                <span className="px-3 py-1.5 bg-white border border-red-100 text-red-500 rounded-xl text-[11px] font-bold shadow-sm">担心流动性</span>
                            </div>
                        </div>
                    </div>

                    {/* Family Structure */}
                    <div
                        onClick={() => setIsFamilyPopupOpen(true)}
                        className="bg-white border border-gray-100 rounded-[32px] p-0 shadow-xl relative group overflow-hidden mb-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50/30 rounded-bl-full -z-0"></div>

                        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur z-10 relative">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-sm shadow-sm">
                                    <i className="fa-solid fa-people-roof"></i>
                                </span>
                                <span className="text-sm font-black text-gray-700">家庭成员保障图谱</span>
                            </div>
                            <button className="text-[11px] bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-500 px-3 py-1.5 rounded-full font-bold transition-all">
                                详情配置 <i className="fa-solid fa-chevron-right text-[9px] ml-1"></i>
                            </button>
                        </div>

                        <div className="p-6 flex items-center justify-around z-10 relative">
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-14 h-14 rounded-full border-4 border-green-400 p-0.5 bg-white shadow-lg" alt="Avatar" />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full border-2 border-white font-black shadow-sm">
                                        已保</div>
                                </div>
                                <span className="text-xs font-black text-gray-700">本人</span>
                            </div>

                            <div className="h-0.5 w-12 bg-gradient-to-r from-green-200 to-orange-200 rounded-full"></div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wife" className="w-14 h-14 rounded-full border-4 border-orange-300 p-0.5 bg-white shadow-lg grayscale opacity-60" alt="Avatar" />
                                    <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full border-2 border-white font-black shadow-sm">
                                        缺口</div>
                                </div>
                                <span className="text-xs font-black text-gray-700">配偶</span>
                            </div>

                            <div className="h-0.5 w-12 bg-gray-100 rounded-full"></div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 text-gray-300 shadow-sm">
                                        <i className="fa-solid fa-plus text-lg"></i>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-gray-400">子女</span>
                            </div>
                        </div>
                    </div>

                    {/* Case Scenarios (Script Tips) */}
                    <div className="bg-white rounded-[32px] shadow-xl flex flex-col overflow-hidden relative border border-gray-100 pb-6 mb-8">
                        <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50">
                            <span className="text-sm font-black text-gray-800 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-sm shadow-sm">
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </span>
                                话术锦囊对话记录 (12)
                            </span>
                            <button className="text-xs text-orange-500 hover:text-orange-600 font-black px-3 py-1.5 bg-orange-50 rounded-full transition-colors">
                                查看全部
                            </button>
                        </div>

                        <div className="flex overflow-x-auto gap-4 px-6 pb-2 snap-x snap-mandatory scrollbar-hide no-scrollbar items-start pt-4">
                            <div className="w-[85%] snap-center bg-white border border-orange-200 rounded-[28px] p-5 shadow-sm flex flex-col h-44 relative group shrink-0">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-sm">
                                        🔥 降维打击策略
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">刚刚</span>
                                </div>

                                <div className="relative flex-1">
                                    <i className="fa-solid fa-quote-left text-orange-100 text-3xl absolute -top-2 -left-2"></i>
                                    <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3 pl-5 pt-1 font-bold">
                                        王总，咱们先把保额锁定，用定期消费型把杠杆拉满，每年只要6000多。等过几年经济环境好了，咱们再补终身...
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleCopy(1)}
                                    className={`w-full mt-3 py-2.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm ${copiedId === 1 ? 'bg-green-500 border-green-500 text-white scale-105' : 'bg-white border-orange-200 text-orange-600 hover:bg-orange-50'}`}
                                >
                                    {copiedId === 1 ? (
                                        <>
                                            <i className="fa-solid fa-check"></i> 已复制到剪贴板
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-regular fa-copy"></i> 点击一键复制话术
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="w-[85%] snap-center bg-white border border-gray-100 rounded-[28px] p-5 shadow-sm flex flex-col h-44 group shrink-0">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-red-400 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-sm">
                                        🛡️ 处理“嫌贵”异议
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">昨天 14:30</span>
                                </div>

                                <div className="relative flex-1">
                                    <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3 pt-1 font-bold">
                                        这笔钱其实不是消费，而是把未来的不确定风险成本锁定。如果我们分摊到每天，其实也就是半杯咖啡钱，但能换一个千万级的安心...
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleCopy(2)}
                                    className={`w-full mt-3 py-2.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm ${copiedId === 2 ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
                                >
                                    <i className="fa-regular fa-copy"></i> 复制话术
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto px-1">
                        <button className="w-full py-4 rounded-[28px] bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-100 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm font-black flex items-center justify-center gap-3">
                            <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
                            使用 AI 重新配置客户档案与方案
                        </button>
                    </div>
                </div>
            </main>

            {/* Popups (Family Graph) */}
            {isFamilyPopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                        onClick={() => setIsFamilyPopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-800">家庭关系网与成员配置</h3>
                            <button
                                onClick={() => setIsFamilyPopupOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-5 rounded-[28px] bg-gray-50 border-2 border-transparent hover:border-orange-500 transition-all cursor-pointer group shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md p-1 group-hover:scale-110 transition-all">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-full h-full rounded-xl" alt="Avatar" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-gray-800">王志远 (本人)</p>
                                            <p className="text-xs text-orange-500 font-bold mt-1">42岁 · 企业高管 · 已有千万保单</p>
                                        </div>
                                    </div>
                                    <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-orange-500 transition-all"></i>
                                </div>

                                <div className="p-6 rounded-[28px] border-2 border-orange-200 bg-orange-50/30 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-white shadow-md p-1">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wife" className="w-full h-full rounded-xl" alt="Avatar" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-gray-900">张女士 (配偶)</p>
                                                <p className="text-sm text-orange-600 font-bold mt-1 animate-pulse">正在智能核保配置中...</p>
                                            </div>
                                        </div>
                                        <button className="text-sm text-white bg-orange-500 px-5 py-2 rounded-2xl shadow-lg shadow-orange-100 font-black hover:opacity-90 transition-all">
                                            保存设置
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/80 p-4 rounded-2xl border border-orange-100">
                                            <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block">出生年份</label>
                                            <select className="w-full text-sm bg-transparent border-none font-bold text-gray-700 focus:outline-none">
                                                <option>1985年 (38岁)</option>
                                                <option>1986年 (37岁)</option>
                                            </select>
                                        </div>
                                        <div className="bg-white/80 p-4 rounded-2xl border border-orange-100">
                                            <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block">职业类别</label>
                                            <select className="w-full text-sm bg-transparent border-none font-bold text-gray-700 focus:outline-none">
                                                <option>1类 (公司职员)</option>
                                                <option>2类</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 rounded-[28px] border-2 border-dashed border-gray-200 text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all text-sm font-black flex items-center justify-center gap-3">
                                    <i className="fa-solid fa-plus text-lg"></i>
                                    添加新的家庭成员信息
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scheme Detail Popup */}
            {isSchemePopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                        onClick={() => setIsSchemePopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-800">保险对比方案详情</h3>
                            <button
                                onClick={() => setIsSchemePopupOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                                    <p className="font-bold text-orange-800">方案核心：高杠杆定期重疾</p>
                                    <p className="text-sm text-orange-600 mt-1">优先锁定身故与重疾保障，减轻当前现金流压力。</p>
                                </div>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                    <p className="font-bold text-gray-800">备选方案：终身重疾+高端医疗</p>
                                    <p className="text-sm text-gray-400 mt-1">适合在收入持续增长后，进行一次性养老与医疗品质升级。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerProfilePage;
