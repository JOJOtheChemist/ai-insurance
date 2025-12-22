import React, { useState, useRef } from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface InsuranceSchemePanelProps {
    proposedPlans?: CustomerProfile['proposed_plans'];
}

const InsuranceSchemePanel: React.FC<InsuranceSchemePanelProps> = ({ proposedPlans }) => {
    const [activeSchemeIndex, setActiveSchemeIndex] = useState(0);
    const [isSchemePopupOpen, setIsSchemePopupOpen] = useState(false);
    const schemeScrollRef = useRef<HTMLDivElement>(null);

    const handleSchemeScroll = () => {
        if (schemeScrollRef.current) {
            const { scrollLeft, clientWidth } = schemeScrollRef.current;
            const index = Math.round(scrollLeft / (clientWidth * 0.85));
            setActiveSchemeIndex(index);
        }
    };

    return (
        <>
            <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden relative border border-gray-100 pb-4 shrink-0 mb-6">
                <div className="px-5 py-3 flex justify-between items-center bg-gray-50/50">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <i className="fa-solid fa-layer-group text-orange-500"></i> 推荐保险方案 ({proposedPlans?.length || 0})
                    </span>
                    <div className="flex gap-1 transition-all duration-300">
                        {proposedPlans?.map((_, i) => (
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
                    {proposedPlans && proposedPlans.length > 0 ? (
                        proposedPlans.map((plan, idx) => (
                            <div key={idx} onClick={() => { setActiveSchemeIndex(idx); setIsSchemePopupOpen(true); }} className="min-w-[85%] snap-center relative rounded-[24px] overflow-hidden shadow-lg shadow-orange-100 group cursor-pointer h-40 shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FF9A5C]"></div>
                                <i className="fa-solid fa-wand-magic-sparkles absolute top-3 right-3 text-white/20 text-4xl"></i>

                                <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/30 flex items-center gap-1">
                                                <i className="fa-solid fa-shield-heart text-white"></i> {plan.tag || '推荐方案'}
                                            </span>
                                            <span className="text-2xl font-black tracking-tight">#{proposedPlans.length - idx}</span>
                                        </div>
                                        <p className="text-sm font-bold opacity-85">{plan.title}</p>
                                        <p className="text-[11px] opacity-70 mt-1 line-clamp-2">{plan.description || plan.reasoning || '暂无描述'}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-semibold tracking-wide">
                                        <span className="flex items-center gap-1">
                                            <i className="fa-solid fa-box-open"></i> {plan.products.length}款产品
                                        </span>
                                        <span>预算：{plan.budget || '待定'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="min-w-[85%] snap-center relative rounded-[24px] overflow-hidden border border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 h-40 shrink-0 text-gray-400 gap-2">
                            <i className="fa-regular fa-clipboard text-2xl"></i>
                            <span className="text-xs font-bold">暂无AI推荐方案</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scheme Popup */}
            {isSchemePopupOpen && proposedPlans && proposedPlans[activeSchemeIndex] && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSchemePopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-md h-[85vh] bg-white rounded-t-[30px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="relative h-48 bg-gradient-to-br from-[#FF6B35] to-[#FF9A5C] shrink-0">
                            <i className="fa-solid fa-wand-magic-sparkles absolute top-[-20%] right-[-10%] text-white/10 text-[200px] rotate-12"></i>
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F2F4F6] to-transparent"></div>

                            <div className="relative z-10 p-6 pt-12 text-white">
                                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/30 inline-flex items-center gap-1 mb-3">
                                    <i className="fa-solid fa-shield-heart"></i> {proposedPlans[activeSchemeIndex].tag || '推荐方案'}
                                </span>
                                <h2 className="text-2xl font-black mb-1">{proposedPlans[activeSchemeIndex].title}</h2>
                                <p className="opacity-80 text-xs">{proposedPlans[activeSchemeIndex].description}</p>
                            </div>

                            <button
                                onClick={() => setIsSchemePopupOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center backdrop-blur transition-all"
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
                                    {proposedPlans[activeSchemeIndex].products.map((prod, pIdx) => (
                                        <div key={pIdx} className={`p-3 border rounded-2xl flex items-center gap-3 ${prod.type === 'main' ? 'border-orange-200 bg-white shadow-sm' : 'border-gray-100 bg-gray-50 opacity-80'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${prod.type === 'main' ? 'bg-orange-100 text-orange-500' : 'bg-white text-gray-400 shadow-sm'}`}>
                                                <i className={`fa-solid ${prod.type === 'main' ? 'fa-heart-pulse' : 'fa-user-doctor'}`}></i>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-700">{prod.name}</p>
                                                <p className="text-xs text-gray-400">{prod.coverage} {prod.reason ? `· ${prod.reason}` : ''}</p>
                                            </div>
                                            {prod.type === 'main' ? <i className="fa-solid fa-check-circle text-orange-500"></i> : <i className="fa-regular fa-circle text-gray-300"></i>}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xs font-bold text-gray-800 mb-3 ml-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> 方案记录
                                    </h3>
                                    <div className="bg-gray-50 rounded-2xl p-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 pb-2 border-b border-gray-200">
                                            <span>{proposedPlans[activeSchemeIndex].created_at || '刚刚'}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-snug">{proposedPlans[activeSchemeIndex].reasoning}</p>
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

export default InsuranceSchemePanel;
