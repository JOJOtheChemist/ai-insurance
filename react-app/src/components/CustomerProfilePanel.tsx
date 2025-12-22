import React from 'react';
import type { CustomerProfile } from './CustomerInfoCards';
import FamilyStructurePanel from './profile/FamilyStructurePanel';
import FollowUpPanel from './profile/FollowUpPanel';
import ContactPanel from './profile/ContactPanel';
import InsuranceSchemePanel from './profile/InsuranceSchemePanel';

interface CustomerProfilePanelProps {
    className?: string;
    customerData?: CustomerProfile | null;
}

const CustomerProfilePanel: React.FC<CustomerProfilePanelProps> = ({ className = "", customerData }) => {
    // 使用真实数据或默认值
    const displayName = customerData?.name || '待确认';
    const displayRole = customerData?.role || '待确认';
    const displayAge = customerData?.age ? String(customerData.age) : '-';
    const displayBudget = customerData?.annual_budget ? String(customerData.annual_budget) : '-';
    const displayIncome = customerData?.annual_income ?
        (parseInt(customerData.annual_income) >= 10000 ? `${(parseInt(customerData.annual_income) / 10000).toFixed(0)}万+` : customerData.annual_income)
        : '-';
    const displayLocation = customerData?.location || '待确认';
    const displayMarital = customerData?.marital_status || '待确认';
    const riskFactors = customerData?.risk_factors?.length ? customerData.risk_factors : [];
    const needs = (customerData?.needs && customerData.needs[0] !== '待确认') ? customerData.needs : [];
    const resistances = (customerData?.resistances && customerData.resistances.length > 0) ? customerData.resistances : [];

    return (
        <div className={`bg-white p-6 flex flex-col overflow-y-auto scrollbar-hide ${className || 'w-[400px] border border-orange-100 shadow-xl rounded-[24px] h-[850px]'}`}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 pl-1">Customer Profile</h2>

            <div className="bg-orange-50/50 rounded-[30px] p-5 mb-4 border border-orange-100 relative overflow-hidden group shrink-0">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-200/20 rounded-full blur-xl group-hover:bg-orange-300/30 transition-all"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full p-1 bg-white shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'guest'}`} className="w-full h-full rounded-full" alt="Client" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{displayName}</h3>
                            <p className="text-xs text-gray-500 mt-1">{displayRole} {displayAge !== '-' ? `(${displayAge}岁)` : ''}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-[0_4px_12px_-2px_rgba(255,166,0,0.1)] border border-[#FFF0E0] p-3 flex flex-col items-center justify-center shrink-0 min-w-[100px] ml-4">
                        <div className="flex items-center gap-1 mb-1">
                            <i className="fa-solid fa-wallet text-orange-500 text-xs"></i>
                            <span className="text-[10px] text-gray-400 font-bold">年预算</span>
                        </div>
                        <div className="text-gray-900 leading-none flex items-baseline">
                            <span className="text-3xl font-black tracking-tight">{displayBudget.replace('万', '')}</span>
                            {displayBudget !== '-' && displayBudget.includes('万') && <span className="text-sm font-bold ml-1 text-gray-500">万</span>}
                        </div>
                    </div>
                </div>

                <div className="mt-4 border-t border-orange-100/50 pt-3">
                    <p className="text-[10px] font-bold text-orange-400 uppercase mb-2 tracking-wider opacity-80">
                        <i className="fa-solid fa-address-card mr-1"></i>客户画像
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">{displayMarital}</span>
                        <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">年收 {displayIncome}</span>
                        <span className="px-3 py-1 bg-white border border-orange-100 text-gray-600 rounded-full text-xs font-medium">{displayLocation}</span>
                    </div>
                </div>
            </div>

            {riskFactors.length > 0 && (
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
            )}

            <div className="grid grid-cols-2 gap-3 mb-6 shrink-0">
                <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100 flex flex-col h-full">
                    <span className="text-[10px] font-bold text-orange-400 mb-2 tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-bullseye"></i> 需求点
                    </span>
                    <div className="flex flex-wrap gap-1.5 align-content-start">
                        {needs.length > 0 ? (
                            needs.map((need, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-orange-100 text-gray-600 rounded-lg text-[10px] shadow-sm leading-tight">
                                    {need}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-gray-400 italic">暂无需求记录</span>
                        )}
                    </div>
                </div>


                <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100 flex flex-col h-full">
                    <span className="text-[10px] font-bold text-red-400 mb-2 tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-shield-virus"></i> 抗拒点
                    </span>
                    <div className="flex flex-wrap gap-1.5 align-content-start">
                        {resistances.length > 0 ? (
                            resistances.map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-red-100 text-red-400 rounded-lg text-[10px] shadow-sm leading-tight">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-gray-400 italic">暂无抗拒点</span>
                        )}
                    </div>
                </div>
            </div>

            <InsuranceSchemePanel proposedPlans={customerData?.proposed_plans} />

            <FamilyStructurePanel customerData={customerData} />

            <FollowUpPanel followUps={customerData?.follow_ups} />

            <ContactPanel contacts={customerData?.contacts} />

        </div>
    );
};

export default CustomerProfilePanel;
