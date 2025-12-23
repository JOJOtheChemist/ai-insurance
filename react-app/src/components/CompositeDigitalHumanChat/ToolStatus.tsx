
import React, { useState } from 'react';
import { GenericToolDisplay } from './GenericToolDisplay';

export interface ToolCall {
    id: string;
    name: string;
    status: 'running' | 'success' | 'failed';
    args?: any;
    result?: any;
    timestamp?: number;
}

export const ToolStatus: React.FC<{ tool: ToolCall }> = ({ tool }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Debug logging
    if (tool.name === 'submit_insurance_plan') {
        console.log('🔍 submit_insurance_plan tool detected:', {
            status: tool.status,
            hasArgs: !!tool.args,
            hasPlan: !!(tool.args?.plan),
            args: tool.args
        });
    }

    // Check if this is a successful submit_insurance_plan call  
    if (tool.name === 'submit_insurance_plan' && tool.status === 'success' && tool.args?.plan) {
        const plan = tool.args.plan;

        return (
            <div className="w-full mb-2">
                {/* Insurance Plan Card - matching InsuranceSchemePanel design */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative rounded-[24px] overflow-hidden shadow-lg shadow-orange-100 cursor-pointer h-40"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FF9A5C]"></div>
                    <i className="fa-solid fa-wand-magic-sparkles absolute top-3 right-3 text-white/20 text-4xl"></i>

                    <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <span className="bg-[#FF9366] px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/40 flex items-center gap-1">
                                    <i className="fa-solid fa-shield-heart text-white"></i> {plan.tag || '推荐方案'}
                                </span>
                                <i className={`fa-solid fa-chevron-down text-white text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
                            </div>
                            <p className="text-sm font-bold text-white break-words line-clamp-1">{plan.title}</p>
                            <p className="text-[11px] text-[#FFD8C2] mt-1 line-clamp-2 break-words">{plan.description || tool.args.reasoning || '暂无描述'}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold tracking-wide gap-2">
                            <span className="flex items-center gap-1 shrink-0">
                                <i className="fa-solid fa-box-open"></i> {plan.products?.length || 0}款产品
                            </span>
                            <span className="truncate">预算：{plan.budget || '待定'}</span>
                        </div>
                    </div>
                </div>

                {/* Expanded Product List */}
                {isOpen && plan.products && plan.products.length > 0 && (
                    <div className="mt-2 bg-[#F9FAFB] rounded-[20px] p-4 border border-gray-100 animate-in slide-in-from-top duration-200">
                        <h3 className="text-xs font-bold text-gray-800 mb-3 ml-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> 推荐保险组合
                        </h3>
                        <div className="space-y-2">
                            {plan.products.map((prod: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`p-3 border rounded-xl flex items-start gap-3 ${prod.type === 'main'
                                        ? 'border-orange-200 bg-white shadow-sm'
                                        : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${prod.type === 'main'
                                        ? 'bg-orange-100 text-orange-500'
                                        : 'bg-blue-50 text-blue-500'
                                        }`}>
                                        <i className={`fa-solid ${prod.type === 'main' ? 'fa-heart-pulse' : 'fa-shield-halved'}`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-bold text-gray-700 line-clamp-2">{prod.name}</p>
                                            {prod.type === 'main' ? (
                                                <i className="fa-solid fa-check-circle text-orange-500 shrink-0 mt-0.5"></i>
                                            ) : (
                                                <i className="fa-solid fa-plus-circle text-blue-500 shrink-0 mt-0.5"></i>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prod.coverage}</p>
                                        {prod.reason && (
                                            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{prod.reason}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {tool.args.reasoning && (
                            <div className="mt-4">
                                <h3 className="text-xs font-bold text-gray-800 mb-2 ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> 方案说明
                                </h3>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                    <p className="text-xs text-gray-600 leading-relaxed">{tool.args.reasoning}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // For all other tools, use the generic display
    return <GenericToolDisplay tool={tool} />;
};
