import React, { useState } from 'react';
import CompositeDigitalHumanChat from '../components/CompositeDigitalHumanChat/index';

const tabs = [
    { key: 'ai', label: 'AI对话', desc: '实时同步王志远的问答纪要。' },
    { key: 'product', label: '产品', desc: '对比 3 款重疾与医疗组合。' },
    { key: 'customer', label: '客户', desc: '客户画像、预算与家庭结构。' },
    { key: 'digital', label: '数字人', desc: '数字人讲解脚本与出场准备。' },
    { key: 'personal', label: '个人', desc: '顾问待办与今日提醒。' },
];

const AIWorkspaceMobile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('ai');

    return (
        <div className="min-h-screen bg-[#F4F7FB] py-8 px-4 font-['Noto_Sans_SC'] flex justify-center">
            <div className="w-full max-w-md bg-white rounded-[32px] border border-gray-100 shadow-xl flex flex-col overflow-hidden min-h-[780px]">
                {/* 顶部占位 */}
                <div className="bg-gradient-to-br from-orange-200 via-orange-100 to-white px-5 py-6">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">AI WORKSPACE</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">移动工作台</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        顶部区域可用于 Banner / 轮播，左右子模块可自定义用于洞察与操作。
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="rounded-2xl bg-white/90 border border-white px-3 py-2 shadow-sm">
                            <p className="font-semibold text-gray-800">洞察区</p>
                            <p className="text-[11px] text-gray-500 mt-1">展示 AI 洞察 / 快讯。</p>
                        </div>
                        <div className="rounded-2xl bg-white/90 border border-white px-3 py-2 shadow-sm">
                            <p className="font-semibold text-gray-800">操作区</p>
                            <p className="text-[11px] text-gray-500 mt-1">放置按钮/步骤/提醒。</p>
                        </div>
                    </div>
                </div>

                {/* 菜单 */}
                <div className="px-5 pt-5">
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">菜单</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {tabs.map((tab) => {
                                const isActive = tab.key === activeTab;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-4 py-2 rounded-2xl border text-sm font-bold transition-all duration-200 ${isActive ? 'border-orange-300 bg-white text-orange-600 shadow-sm' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 内容 */}
                <div className="flex-1 px-5 py-6 flex flex-col gap-4">
                    <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-100 p-4 shadow-inner overflow-hidden">
                        {activeTab === 'ai' ? (
                            <div className="h-full bg-white rounded-3xl border border-gray-100 shadow overflow-hidden">
                                <CompositeDigitalHumanChat />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col gap-4 text-xs text-gray-600">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{tabs.find((tab) => tab.key === activeTab)?.label} · 内容占位</p>
                                    <p className="text-xs text-gray-500 mt-1">{tabs.find((tab) => tab.key === activeTab)?.desc}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    <div className="rounded-2xl border border-dashed border-gray-300 p-3 flex flex-col justify-between">
                                        <span className="text-sm font-semibold text-gray-900">左模块</span>
                                        <p>卡片、图表或列表。</p>
                                    </div>
                                    <div className="rounded-2xl border border-dashed border-gray-300 p-3 flex flex-col justify-between">
                                        <span className="text-sm font-semibold text-gray-900">右模块</span>
                                        <p>操作、预约、上传区域。</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 底部菜单 */}
                <nav className="border-t border-gray-100 bg-white">
                    <div className="grid grid-cols-5">
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeTab;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex flex-col items-center justify-center py-3 text-[11px] font-bold transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400'}`}
                                >
                                    <span className={`w-8 h-8 rounded-2xl flex items-center justify-center mb-1 text-sm ${isActive ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-gray-50 text-gray-400 border border-transparent'}`}>
                                        {tab.label.slice(0, 1)}
                                    </span>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default AIWorkspaceMobile;
