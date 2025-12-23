import React from 'react';

// 定义客户画像数据类型
export interface CustomerProfile {
    name?: string;
    role?: string;
    age?: string | number;  // 支持字符串和数字
    annual_budget?: string;
    marital_status?: string;
    annual_income?: string;
    location?: string;
    risk_factors?: string[];
    needs?: string[];
    resistances?: string[];
    contacts?: {
        name: string;
        role: string;
        type?: string;     // secretary, finance, doctor, etc.
        contact_info?: string;
        actions?: string[];
        avatar_seed?: string;
    }[];
    family_structure?: {
        relation: string;
        name?: string;
        age?: number;
        status?: string;
    }[];
    follow_ups?: {
        type: string;     // AI, 电话, 微信
        content: string;
        time: string;
        session_id?: string;
    }[];
    proposed_plans?: {
        title: string;
        tag?: string;
        budget?: string;
        description?: string;
        products: {
            name: string;
            coverage: string;
            type: string;
            reason?: string;
        }[];
        reasoning?: string;
        created_at?: string;
    }[];
}

// 1. 客户基本信息卡片
export const CustomerBasicCard: React.FC<{ data: CustomerProfile }> = ({ data }) => {
    // 格式化收入和预算显示
    const formatIncome = (income?: string) => {
        if (!income || income === '待确认') return '待确认';
        const num = parseInt(income);
        if (num >= 10000) return `${(num / 10000).toFixed(0)}万+`;
        return income;
    };

    const formatBudget = (budget?: string) => {
        if (!budget || budget === '待确认') return '待确认';
        return budget;
    };

    return (
        <div className="bg-[#FFF9F2] rounded-[24px] p-4 border border-orange-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FFEBD6] rounded-full blur-xl transition-all"></div>
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full p-1 bg-white shadow-sm">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'default'}`}
                            className="w-full h-full rounded-full"
                            alt="Client"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{data.name || '客户'}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {data.role || '待确认'} ({String(data.age) || '?'}岁)
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[16px] shadow-sm border border-orange-100 p-2.5 flex flex-col items-center justify-center min-w-[85px]">
                    <div className="flex items-center gap-1 mb-0.5">
                        <i className="fa-solid fa-wallet text-orange-500 text-xs"></i>
                        <span className="text-[10px] text-gray-400 font-bold">年预算</span>
                    </div>
                    <div className="text-gray-900 leading-none">
                        <span className="text-xl font-black">{formatBudget(data.annual_budget)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 border-t border-orange-100 pt-2.5">
                <p className="text-[10px] font-bold text-orange-400 uppercase mb-1.5 tracking-wider">
                    <i className="fa-solid fa-address-card mr-1"></i>客户画像
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {data.marital_status && (
                        <span className="px-2.5 py-0.5 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">
                            {data.marital_status}
                        </span>
                    )}
                    {data.annual_income && data.annual_income !== '待确认' && (
                        <span className="px-2.5 py-0.5 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">
                            年收{formatIncome(data.annual_income)}
                        </span>
                    )}
                    {data.location && (
                        <span className="px-2.5 py-0.5 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">
                            {data.location}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. 风险因素卡片
export const RiskFactorsCard: React.FC<{ factors: string[] }> = ({ factors }) => {
    if (!factors || factors.length === 0) return null;

    return (
        <div className="mt-2">
            <h3 className="text-xs font-bold text-gray-800 mb-2 ml-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 风险因素
            </h3>
            <div className="flex flex-wrap gap-2">
                {factors.map((factor, idx) => (
                    <div
                        key={idx}
                        className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-triangle-exclamation"></i> {factor}
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. 需求点卡片
export const DemandPointsCard: React.FC<{ demands: string[] }> = ({ demands }) => {
    if (!demands || demands.length === 0 || (demands.length === 1 && demands[0] === '待确认')) return null;

    return (
        <div className="bg-[#FFF9F2] rounded-2xl p-3 border border-orange-100 flex flex-col h-full">
            <span className="text-[10px] font-bold text-orange-400 mb-2 tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-bullseye"></i> 需求点
            </span>
            <div className="flex flex-wrap gap-1.5">
                {demands.map((demand, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-1 bg-white border border-orange-100 text-gray-600 rounded-lg text-[10px] shadow-sm leading-tight"
                    >
                        {demand}
                    </span>
                ))}
            </div>
        </div>
    );
};

// 4. 抗拒点卡片（暂时不显示，因为JSON里没有这个字段）
export const ResistancePointsCard: React.FC<{ resistances?: string[] }> = ({ resistances }) => {
    if (!resistances || resistances.length === 0) return null;

    return (
        <div className="bg-[#FFF5F5] rounded-2xl p-3 border border-red-100 flex flex-col h-full">
            <span className="text-[10px] font-bold text-red-400 mb-2 tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-shield-virus"></i> 抗拒点
            </span>
            <div className="flex flex-wrap gap-1.5">
                {resistances.map((resistance, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-1 bg-white border border-red-100 text-red-400 rounded-lg text-[10px] shadow-sm leading-tight"
                    >
                        {resistance}
                    </span>
                ))}
            </div>
        </div>
    );
};

// 组合卡片容器 - 用于在对话框中渲染
export const CustomerProfileCards: React.FC<{ data: CustomerProfile }> = ({ data }) => {
    const hasDemands = data.needs && data.needs.length > 0 && data.needs[0] !== '待确认';
    const hasRisks = data.risk_factors && data.risk_factors.length > 0;

    return (
        <div className="space-y-3 max-w-md">
            <CustomerBasicCard data={data} />

            {hasRisks && <RiskFactorsCard factors={data.risk_factors!} />}

            {hasDemands && (
                <div className="grid grid-cols-1 gap-2">
                    <DemandPointsCard demands={data.needs!} />
                </div>
            )}
        </div>
    );
};
