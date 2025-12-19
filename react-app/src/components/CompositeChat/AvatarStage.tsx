import React from 'react';
import { CustomerContextCard } from './CustomerContextCard';
import type { CustomerProfile } from '../CustomerInfoCards';

interface AvatarStageProps {
    stage: 0 | 1 | 2;
    isCustomerMounted: boolean;
    customerProfile: CustomerProfile | null;
    onHistoryDrawerToggle: () => void;
    onCustomerMount: () => void;
    onCustomerCardClick: () => void;
}

export const AvatarStage: React.FC<AvatarStageProps> = ({
    stage,
    isCustomerMounted,
    customerProfile,
    onHistoryDrawerToggle,
    onCustomerMount,
    onCustomerCardClick
}) => {
    const getAvatarStageClasses = () => {
        if (stage === 2) return '-translate-y-full opacity-0 pointer-events-none h-0';
        if (stage === 1) return 'h-[200px]';
        return 'h-[48%]';
    };

    return (
        <div
            id="avatar-stage"
            className={`w-full flex justify-center items-end overflow-hidden relative bg-[radial-gradient(circle_at_center,_#374151_0%,_#111827_100%)] transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) z-0 nav-safe-pt ${getAvatarStageClasses()}`}
            style={{ paddingTop: '60px' }}
        >
            {/* Top Controls (Only visible in S0/S1, hidden in S2 by parent transition) */}
            <div className={`absolute top-0 left-0 w-full p-4 flex justify-between items-center z-30 text-white/80 ${stage === 2 ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
                <button
                    onClick={onHistoryDrawerToggle}
                    className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                </button>
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold">策略官 V3 · 在线</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center">
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>

            {/* Context Card Area (Only Stage 0 & 1) */}
            <div className={`absolute top-16 left-0 w-full px-4 z-30 ${stage === 2 ? 'hidden' : ''}`}>
                <CustomerContextCard
                    isCustomerMounted={isCustomerMounted}
                    customerProfile={customerProfile}
                    onMount={onCustomerMount}
                    onCardClick={onCustomerCardClick}
                />
            </div>

            {/* Avatar Image */}
            <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                className={`rounded-full border-4 border-white/10 shadow-2xl z-10 transition-all duration-600 ease-out origin-bottom ${stage >= 1 ? 'w-56 h-56 scale-60 translate-y-5 opacity-80' : 'w-56 h-56 mb-4'}`}
                alt="Current Avatar"
            />

            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#111827] to-transparent z-0"></div>
        </div>
    );
};
