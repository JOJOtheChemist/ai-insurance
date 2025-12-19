import React, { useState } from 'react';
import CompositeDigitalHumanChat from '../components/CompositeDigitalHumanChat';

const tabs = [
    { key: 'ai', label: 'AI对话', desc: '实时同步王志远的问答纪要。' },
    { key: 'product', label: '产品', desc: '对比 3 款重疾与医疗组合。' },
    { key: 'customer', label: '客户', desc: '客户画像、预算与家庭结构。' },
    { key: 'digital', label: '数字人', desc: '数字人讲解脚本与出场准备。' },
    { key: 'personal', label: '个人', desc: '顾问待办与今日提醒。' },
];

const AIWorkspacePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('ai');

    return (
        <div className="min-h-screen bg-[#F4F7FB] py-10 px-8 font-['Noto_Sans_SC']">
            <div className="max-w-6xl mx-auto grid grid-cols-[250px_auto] gap-8">
                {/* 左侧目录 */}
                <aside className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">目录</p>
                        <h2 className="text-xl font-bold text-gray-900 mt-2">今日流程</h2>
                        <p className="text-xs text-gray-400">模拟 H5 工作台导航</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'AI 触达', desc: '自动对话&同步', status: '进行中', color: 'bg-orange-100 text-orange-600' },
                            { title: '产品筹备', desc: '选择组合方案', status: '待处理', color: 'bg-gray-100 text-gray-500' },
                            { title: '客户跟进', desc: '纪要/提醒', status: '排期', color: 'bg-blue-50 text-blue-500' },
                            { title: '数字人演示', desc: '脚本预演', status: '准备', color: 'bg-purple-50 text-purple-500' },
                        ].map((item) => (
                            <div key={item.title} className="p-4 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.color}`}>{item.status}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* 右侧内容容器 */}
                <section className="flex justify-center">
                    <div className="w-full max-w-[440px] bg-white rounded-[32px] border border-gray-100 shadow-xl flex flex-col overflow-hidden min-h-[820px]">
                        {/* 顶部占位内容 */}
                        <div className="bg-gradient-to-br from-orange-200 via-orange-100 to-white px-5 py-6">
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">AI WORKSPACE</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">H5 页面布局</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                顶部区域可用于放置轮播、直播、或 Banner。左右区域分别呈现洞察与操作。
                            </p>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                                <div className="rounded-2xl bg-white/90 border border-white px-3 py-2 shadow-sm">
                                    <p className="font-semibold text-gray-800">左侧区</p>
                                    <p className="text-[11px] text-gray-500 mt-1">展示 AI 洞察 / 快讯。</p>
                                </div>
                                <div className="rounded-2xl bg-white/90 border border-white px-3 py-2 shadow-sm">
                                    <p className="font-semibold text-gray-800">右侧区</p>
                                    <p className="text-[11px] text-gray-500 mt-1">放置操作 / 按钮。</p>
                                </div>
                            </div>
                        </div>

                        {/* 中部内容区 */}
                        <div className="flex-1 px-5 py-6 flex flex-col gap-4">
                            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">菜单</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tabs.map((tab) => {
                                        const isActive = tab.key === activeTab;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`px-4 py-2 rounded-2xl border text-sm font-bold transition-all duration-200 flex items-center gap-2 ${isActive ? 'border-orange-300 bg-white text-orange-600 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

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
                </section>
            </div>
        </div>
    );
};

export default AIWorkspacePage;
