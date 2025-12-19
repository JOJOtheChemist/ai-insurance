import React, { useState, useRef } from 'react';
import type { CustomerProfile } from './CustomerInfoCards';

interface CustomerProfilePanelProps {
    className?: string;
    customerData?: CustomerProfile | null;
}

const CustomerProfilePanel: React.FC<CustomerProfilePanelProps> = ({ className = "", customerData }) => {
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [activeSchemeIndex, setActiveSchemeIndex] = useState(0);
    const [isFamilyPopupOpen, setIsFamilyPopupOpen] = useState(false);
    const [isDetailedFamilyPopupOpen, setIsDetailedFamilyPopupOpen] = useState(false);
    const [isSchemePopupOpen, setIsSchemePopupOpen] = useState(false);
    const schemeScrollRef = useRef<HTMLDivElement>(null);

    const handleCopy = (id: number) => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleSchemeScroll = () => {
        if (schemeScrollRef.current) {
            const { scrollLeft, clientWidth } = schemeScrollRef.current;
            const index = Math.round(scrollLeft / (clientWidth * 0.85));
            setActiveSchemeIndex(index);
        }
    };

    // 使用真实数据或默认值
    const displayName = customerData?.name || '王志远';
    const displayRole = customerData?.role || '科技公司 CTO';
    const displayAge = customerData?.age || '42';
    const displayBudget = customerData?.annual_budget || '5-8万';
    const displayIncome = customerData?.annual_income ?
        (parseInt(customerData.annual_income) >= 10000 ? `${(parseInt(customerData.annual_income) / 10000).toFixed(0)}万+` : customerData.annual_income)
        : '80w+';
    const displayLocation = customerData?.location || '北京海淀';
    const displayMarital = customerData?.marital_status || '已婚育';
    const riskFactors = customerData?.risk_factors || ['经常应酬', '轻度脂肪肝'];
    const needs = (customerData?.needs && customerData.needs[0] !== '待确认') ? customerData.needs : ['保费压力', '子女教育', '隐私'];

    return (
        <>
            <div className={`bg-white p-6 flex flex-col overflow-y-auto scrollbar-hide ${className || 'w-[400px] border border-orange-100 shadow-xl rounded-[24px] h-[850px]'}`}>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">Customer Profile</h2>

                <div className="bg-orange-50/50 rounded-[30px] p-5 mb-4 border border-orange-100 relative overflow-hidden group shrink-0">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-200/20 rounded-full blur-xl group-hover:bg-orange-300/30 transition-all"></div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full p-1 bg-white shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} className="w-full h-full rounded-full" alt="Client" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{displayName}</h3>
                                <p className="text-xs text-gray-500 mt-1">{displayRole} ({displayAge}岁)</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[20px] shadow-[0_4px_12px_-2px_rgba(255,166,0,0.1)] border border-[#FFF0E0] p-3 flex flex-col items-center justify-center shrink-0 min-w-[100px] ml-4">
                            <div className="flex items-center gap-1 mb-1">
                                <i className="fa-solid fa-wallet text-orange-500 text-xs"></i>
                                <span className="text-[10px] text-gray-400 font-bold">年预算</span>
                            </div>
                            <div className="text-gray-900 leading-none flex items-baseline">
                                <span className="text-3xl font-black tracking-tight">{displayBudget.replace('万', '')}</span>
                                {displayBudget.includes('万') && <span className="text-sm font-bold ml-1 text-gray-500">万</span>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-orange-100/50 pt-3">
                        <p className="text-[10px] font-bold text-orange-400 uppercase mb-2 tracking-wider opacity-80">
                            <i className="fa-solid fa-address-card mr-1"></i>客户画像
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">{displayMarital}</span>
                            <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">年收{displayIncome}</span>
                            <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">{displayLocation}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-2 shrink-0">
                    <h3 className="text-xs font-bold text-gray-800 mb-3 ml-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 风险因素
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {riskFactors.map((factor, idx) => (
                            <div key={idx} className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs flex items-center gap-1.5">
                                <i className="fa-solid fa-wine-glass"></i> {factor}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 shrink-0">
                    <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100 flex flex-col h-full">
                        <span className="text-[10px] font-bold text-orange-400 mb-2 tracking-wider flex items-center gap-1">
                            <i className="fa-solid fa-bullseye"></i> 需求点
                        </span>
                        <div className="flex flex-wrap gap-1.5 align-content-start">
                            {needs.map((need, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-orange-100 text-gray-600 rounded-lg text-[10px] shadow-sm leading-tight">
                                    {need}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100 flex flex-col h-full">
                        <span className="text-[10px] font-bold text-red-400 mb-2 tracking-wider flex items-center gap-1">
                            <i className="fa-solid fa-shield-virus"></i> 抗拒点
                        </span>
                        <div className="flex flex-wrap gap-1.5 align-content-start">
                            <span className="px-2 py-1 bg-white border border-red-100 text-red-400 rounded-lg text-[10px] shadow-sm leading-tight">
                                嫌贵
                            </span>
                            <span className="px-2 py-1 bg-white border border-red-100 text-red-400 rounded-lg text-[10px] shadow-sm leading-tight">
                                怕套牢
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden relative border border-gray-100 pb-4 shrink-0 mb-6">
                    <div className="px-5 py-3 flex justify-between items-center bg-gray-50/50">
                        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-orange-500"></i> 推荐保险方案 (3)
                        </span>
                        <div className="flex gap-1 transition-all duration-300">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeSchemeIndex === i ? 'w-4 bg-orange-500' : 'w-1.5 bg-gray-200'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={schemeScrollRef}
                        onScroll={handleSchemeScroll}
                        className="flex overflow-x-auto gap-4 px-4 pb-2 snap-x snap-mandatory scrollbar-hide no-scrollbar"
                    >
                        <div onClick={() => setIsSchemePopupOpen(true)} className="min-w-[85%] snap-center relative rounded-[24px] overflow-hidden shadow-lg shadow-orange-100 group cursor-pointer h-40 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FF9A5C]"></div>
                            <i className="fa-solid fa-wand-magic-sparkles absolute top-3 right-3 text-white/20 text-4xl"></i>

                            <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/30 flex items-center gap-1">
                                            <i className="fa-solid fa-shield-heart text-white"></i> 主力方案
                                        </span>
                                        <span className="text-2xl font-black tracking-tight">V2.1</span>
                                    </div>
                                    <p className="text-sm font-bold opacity-85">《王总家庭全方位保障计划》</p>
                                    <p className="text-[11px] opacity-70 mt-1">聚焦自身重疾 + 子女教育金储备</p>
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold tracking-wide">
                                    <span className="flex items-center gap-1">
                                        <i className="fa-solid fa-crown"></i> 优化中
                                    </span>
                                    <span>预算：8.2万</span>
                                </div>
                            </div>
                        </div>

                        <div className="min-w-[85%] snap-center relative rounded-[24px] overflow-hidden border border-dashed border-gray-200 flex items-center justify-center grayscale opacity-60">
                            <span className="text-xs font-bold text-gray-400">方案调研中...</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative border border-gray-100 overflow-hidden shrink-0 mb-6">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0"></div>

                    <div onClick={() => setIsDetailedFamilyPopupOpen(true)} className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 relative cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs">
                                <i className="fa-solid fa-people-roof"></i>
                            </span>
                            <span className="text-xs font-bold text-gray-700">家庭结构图谱</span>
                        </div>
                        <button className="text-[10px] bg-gray-100 hover:bg-orange-50 text-gray-500 hover:text-orange-500 px-2 py-1 rounded-full transition-colors">
                            配置 <i className="fa-solid fa-chevron-right text-[8px] ml-0.5"></i>
                        </button>
                    </div>

                    <div className="p-4 flex items-center justify-between z-10 relative">
                        <div className="flex flex-col items-center gap-1 cursor-pointer opacity-100 hover:scale-105 transition-transform">
                            <div className="relative">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wang" className="w-10 h-10 rounded-full border-2 border-green-400 p-0.5 bg-white" alt="Avatar" />
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] px-1 rounded-full border border-white">
                                    保全
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600">本人</span>
                        </div>

                        <div className="h-px w-6 bg-gray-200"></div>

                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                            <div className="relative">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Wife" className="w-10 h-10 rounded-full border-2 border-orange-300 p-0.5 bg-white grayscale opacity-70" alt="Avatar" />
                                <div className="absolute -bottom-1 -right-1 bg-orange-400 text-white text-[8px] px-1 rounded-full border border-white">
                                    缺口
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600">配偶</span>
                        </div>

                        <div className="h-px w-6 bg-gray-200"></div>

                        <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-300">
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">子女</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border border-gray-100 p-5 space-y-4 shrink-0 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-file-signature text-blue-500"></i> 最新跟进记录
                        </span>
                        <span className="text-[10px] text-gray-400">2023.10.24 14:20</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-sm font-bold">
                                AI
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-gray-700">AI助手 (Copilot)</span>
                                    <span className="text-[10px] text-gray-400">自动总结</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    王总关心子女教育基金配置，以及自身重疾保障额度是否足够。建议方案以保障缺口为优先，强调现金流友好型缴费方式。
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-gray-200 p-4 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                                        <i className="fa-solid fa-phone"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-700">电话联系</p>
                                        <p className="text-[10px] text-gray-400">今日 13:20 · 时长 12:40</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-orange-500 font-bold">转文字 {'>'}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                继续跟进家庭成员保障情况，客户表示愿意考虑高端医疗险，但需要详细缴费计划。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border border-gray-100 p-5 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-address-book text-orange-500"></i> 常用联系人
                        </span>
                        <button className="text-[10px] text-gray-400 hover:text-orange-500 transition-colors">查看全部</button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-3 rounded-2xl border border-gray-100 p-3 hover:border-orange-200 transition-colors">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=secretary" className="w-10 h-10 rounded-xl bg-orange-50" alt="Secretary" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800">林秘书</h4>
                                        <p className="text-[10px] text-gray-400">助理 · 主要联系窗口</p>
                                    </div>
                                    <button className="text-[10px] text-gray-400 hover:text-orange-500 flex items-center gap-1">
                                        <i className="fa-solid fa-message"></i> 发消息
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-500">
                                    <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">安排会议</span>
                                    <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">转发材料</span>
                                </div>
                                <button
                                    onClick={() => handleCopy(1)}
                                    className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white shadow-sm ${copiedId === 1 ? 'border-green-400 text-green-500 scale-105' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
                                >
                                    {copiedId === 1 ? (
                                        <>
                                            <i className="fa-solid fa-check"></i> 已复制微信号：LinSec-001
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-copy"></i> 复制微信号
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 rounded-2xl border border-gray-100 p-3 hover:border-orange-200 transition-colors">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=finance" className="w-10 h-10 rounded-xl bg-blue-50" alt="Finance" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800">张财务</h4>
                                        <p className="text-[10px] text-gray-400">财务总监 · 报销/对账</p>
                                    </div>
                                    <button className="text-[10px] text-gray-400 hover:text-blue-500 flex items-center gap-1">
                                        <i className="fa-solid fa-envelope"></i> 发邮件
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-500">
                                    <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">报销流程</span>
                                    <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">发票资料</span>
                                </div>
                                <button
                                    onClick={() => handleCopy(2)}
                                    className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white ${copiedId === 2 ? 'border-green-400 text-green-500 scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
                                >
                                    {copiedId === 2 ? (
                                        <>
                                            <i className="fa-solid fa-check"></i> 已复制邮箱：zhang-finance@ctotech.com
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-copy"></i> 复制邮箱
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 rounded-2xl border border-gray-100 p-3 hover:border-orange-200 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 flex items-center justify-center text-lg">
                                <i className="fa-solid fa-dna"></i>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800">家庭医生</h4>
                                        <p className="text-[10px] text-gray-400">家庭诊疗 · 健康报告上传</p>
                                    </div>
                                    <button className="text-[10px] text-gray-400 hover:text-orange-500 flex items-center gap-1">
                                        <i className="fa-solid fa-file-arrow-up"></i> 上传体检
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-500">
                                    <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">健康数据</span>
                                    <span className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">体检报告</span>
                                </div>
                                <button
                                    onClick={() => handleCopy(3)}
                                    className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white ${copiedId === 3 ? 'border-green-400 text-green-500 scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
                                >
                                    {copiedId === 3 ? (
                                        <>
                                            <i className="fa-solid fa-check"></i> 已复制联系人：家庭医生@WeDoctor
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-copy"></i> 复制联系人
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Family Popup */}
            {isFamilyPopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsFamilyPopupOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-people-roof text-blue-500"></i> 家庭成员AI配置
                            </span>
                            <button
                                onClick={() => setIsFamilyPopupOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3 cursor-pointer" onClick={() => setIsFamilyPopupOpen(false)}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
                                        本
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">本人</p>
                                        <p className="text-[10px] text-gray-400">已配置方案 V2.1</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-chevron-right text-gray-400"></i>
                            </div>

                            <div className="flex items-center justify-between border border-dashed border-gray-200 rounded-2xl p-3 hover:border-orange-200 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <i className="fa-solid fa-user-plus"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">添加家庭成员</p>
                                        <p className="text-[10px] text-gray-400">子女/父母/配偶</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-plus text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scheme Popup */}
            {isSchemePopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSchemePopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-md h-[85vh] bg-white rounded-t-[30px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">保险方案详情</h3>
                            <button
                                onClick={() => setIsSchemePopupOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-[#F2F4F6]">
                            <div className="py-2 shrink-0">
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
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Family Popup from OptimizedCustomerCard */}
            {isDetailedFamilyPopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDetailedFamilyPopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-md bg-white rounded-t-[30px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[85vh]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">家庭结构详细配置</h3>
                            <button
                                onClick={() => setIsDetailedFamilyPopupOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 bg-[#F2F4F6]">
                            {/* Content from OptimizedCustomerCard.tsx */}
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
        </>
    );
};

export default CustomerProfilePanel;
