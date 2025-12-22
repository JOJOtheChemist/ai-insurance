import React from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface CompactHeaderProps {
    stage: 0 | 1 | 2;
    customerProfile: CustomerProfile | null;
    onDrawerToggle: () => void;
    onHistoryDrawerToggle: () => void;
    onNewChat: () => void;
}

export const CompactHeader: React.FC<CompactHeaderProps> = ({
    stage,
    customerProfile,
    onDrawerToggle,
    onHistoryDrawerToggle,
    onNewChat
}) => {
    return (
        <div
            id="compact-header"
            className={`absolute left-0 w-full h-[60px] bg-white/98 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-between px-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${stage === 2 ? 'top-0' : '-top-20'}`}
        >
            <div className="flex items-center gap-2 pl-1">
                <div className="relative">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                        className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100"
                        alt="Avatar Small"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800">数智保险策略官 V3</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onHistoryDrawerToggle}
                                title="查看历史会话"
                                className="w-5 h-5 rounded-md bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-90"
                            >
                                <i className="fa-solid fa-clock-rotate-left text-[10px]"></i>
                            </button>
                            <button
                                onClick={onNewChat}
                                title="开启新会话 (重置状态)"
                                className="w-5 h-5 rounded-md bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-90"
                            >
                                <i className="fa-solid fa-plus text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="group bg-white border border-gray-200 rounded-full pl-[3px] pr-[10px] py-[3px] flex items-center gap-2 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] max-w-[160px] active:scale-98 active:bg-gray-50 hover:border-orange-200 hover:bg-orange-50"
                onClick={onDrawerToggle}
            >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center text-xs font-bold shrink-0">
                    {customerProfile?.name?.charAt(0) || '王'}
                </div>
                <div className="flex flex-col items-start justify-center pr-1 text-left">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-900 leading-none">{customerProfile?.name || '客户'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-medium leading-none mt-1 truncate max-w-[80px]">
                        {customerProfile?.role || '科技公司 CTO'}
                    </span>
                </div>
                <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 ml-1 group-hover:text-orange-300 transition-colors"></i>
            </button>
        </div>
    );
};
