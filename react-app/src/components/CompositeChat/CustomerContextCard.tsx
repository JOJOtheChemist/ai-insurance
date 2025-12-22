import React from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface CustomerContextCardProps {
    isCustomerMounted: boolean;
    customerProfile: CustomerProfile | null;
    onMount: () => void;
    onCardClick: () => void;
}

export const CustomerContextCard: React.FC<CustomerContextCardProps> = ({
    isCustomerMounted,
    customerProfile,
    onMount,
    onCardClick
}) => {
    return (
        <>
            {/* Empty State */}
            <div
                onClick={onMount}
                className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/30 bg-white/5 border-dashed ${isCustomerMounted ? 'hidden' : 'flex'}`}
            >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-plus"></i>
                </div>
                <span className="text-xs font-medium">挂载客户档案以开始</span>
            </div>

            {/* Active State (Glass Card) */}
            <div
                onClick={onCardClick}
                className={`w-full h-16 rounded-2xl items-center justify-between px-3 pl-4 cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 ${isCustomerMounted ? 'flex' : 'hidden'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-base font-bold shadow-lg border border-white/20">
                        {customerProfile?.name?.charAt(0) || '王'}
                    </div>
                    <div className="flex flex-col text-white">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{customerProfile?.name || '客户'}</span>
                            <span className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded backdrop-blur-md">HOT</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/70">
                            <span>{customerProfile?.role || 'CTO'}</span>
                            <span className="w-0.5 h-2 bg-white/30"></span>
                            <span>{customerProfile?.annual_budget ? `预算${customerProfile.annual_budget}` : '预算待定'}</span>
                        </div>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                    <i className="fa-solid fa-address-card text-xs"></i>
                </div>
            </div>
        </>
    );
};
