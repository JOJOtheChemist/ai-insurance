
import React from 'react';

interface PromptCardProps {
    icon: string; // FontAwesome icon class
    iconColorClass: string; // e.g., "bg-orange-50 text-orange-500"
    title: string;
    subtitle: string;
}

export const PromptCard: React.FC<PromptCardProps> = ({ icon, iconColorClass, title, subtitle }) => {
    return (
        <button className="prompt-card w-full p-4 flex items-center justify-between group bg-white border border-[#EEF2F7] shadow-sm rounded-2xl transition-all active:bg-[#F8FAFC] active:scale-98">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${iconColorClass}`}>
                    <i className={icon}></i>
                </div>
                <div className="text-left">
                    <div className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
                </div>
            </div>
            <i className="fa-solid fa-arrow-up text-gray-300 rotate-45 group-hover:text-blue-500 transition-colors"></i>
        </button>
    );
};
