import React from 'react';
import { PromptCard } from '../DigitalHumanChat/PromptCard';
import type { CustomerProfile } from '../CustomerInfoCards';

interface WelcomeViewProps {
    stage: 0 | 1 | 2;
    isCustomerMounted: boolean;
    customerProfile: CustomerProfile | null;
    onPromptClick: (msg: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
    stage,
    isCustomerMounted,
    customerProfile,
    onPromptClick
}) => {
    return (
        <div className={`px-6 flex flex-col h-full bg-[#F5F5F7] transition-all duration-500 overflow-hidden ${stage > 0 ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
            <div className="mb-4 mt-2">
                <h1 className="text-xl font-bold text-gray-900 mb-1">我是数智保险策略官 V3 👋</h1>
                <p className="text-sm text-gray-500">
                    {isCustomerMounted ? (
                        <>已为您准备好 <span className="font-bold text-orange-500">{customerProfile?.name || '客户'}</span> 的档案分析。</>
                    ) : (
                        "高净值家庭的保险策略顾问，擅长条款比对、预算拆解。"
                    )}
                </p>
            </div>

            {!isCustomerMounted && (
                <div className="flex gap-2 mb-6">
                    <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-bold">我是企业主</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">我是高管</span>
                </div>
            )}

            {isCustomerMounted ? (
                <>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">针对该客户的策略建议：</p>
                    <div className="space-y-3 overflow-y-auto no-scrollbar pb-10">
                        <button
                            onClick={() => onPromptClick('生成降维打击方案')}
                            className="w-full bg-[#FFFFFF] p-4 rounded-xl border border-gray-100 flex items-center justify-between group hover:bg-gray-50 transition-colors text-left shadow-sm"
                        >
                            <div>
                                <div className="text-sm font-bold text-gray-800 flex items-center">
                                    <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i>生成降维打击方案
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">"针对价格敏感，先做定期重疾+医疗..."</div>
                            </div>
                        </button>
                        <button
                            onClick={() => onPromptClick('模拟异议处理')}
                            className="w-full bg-[#F0F7FF] p-4 rounded-xl border border-blue-100 flex items-center justify-between group hover:bg-blue-100/50 hover:border-blue-200 transition-colors text-left"
                        >
                            <div>
                                <div className="text-sm font-bold text-gray-800 flex items-center">
                                    <i className="fa-solid fa-microphone-lines text-blue-500 mr-2"></i>模拟异议处理
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">"演练如何回应他对查资产的抗拒..."</div>
                            </div>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">猜你想问</p>
                    <div className="space-y-3 overflow-y-auto no-scrollbar pb-10">
                        <div onClick={() => onPromptClick('企业债务隔离')}>
                            <PromptCard
                                icon="fa-solid fa-scale-balanced"
                                iconColorClass="bg-white text-orange-500 shadow-sm"
                                title="企业债务隔离"
                                subtitle="&quot;公司破产会影响我的个人房产吗？&quot;"
                            />
                        </div>

                        <div onClick={() => onPromptClick('大额保单架构')}>
                            <PromptCard
                                icon="fa-solid fa-piggy-bank"
                                iconColorClass="bg-white text-blue-500 shadow-sm"
                                title="大额保单架构"
                                subtitle="&quot;如何利用保险进行税务合规筹划？&quot;"
                            />
                        </div>

                        <div onClick={() => onPromptClick('子女婚前财产')}>
                            <PromptCard
                                icon="fa-solid fa-child-reaching"
                                iconColorClass="bg-white text-purple-500 shadow-sm"
                                title="子女婚前财产"
                                subtitle="&quot;给孩子买的房怎么防止被分割？&quot;"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
