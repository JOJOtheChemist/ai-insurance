import React, { useState } from 'react';
import DigitalHumanTrainingWorkshop from './DigitalHumanTrainingWorkshop';
import ExpertLibrary from './ExpertLibrary';

const DigitalHumanSection: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'create' | 'library'>('create');

    return (
        <div className="h-full flex flex-col bg-[#F9FAFB] overflow-hidden">
            {/* Top Switcher */}
            <div className="bg-white px-4 pt-4 pb-2 border-b border-gray-100 shrink-0 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="relative bg-gray-100 p-1 rounded-2xl flex items-center h-12 overflow-hidden shadow-inner">
                    {/* Animated Background Slider */}
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${activeSubTab === 'create' ? 'left-1' : 'left-[calc(50%+1px)]'}`}
                    ></div>

                    <button
                        onClick={() => setActiveSubTab('create')}
                        className={`relative z-10 flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${activeSubTab === 'create' ? 'text-gray-900 scale-105' : 'text-gray-400'}`}
                    >
                        <span className="text-[13px] font-black uppercase tracking-tight">创建 AI 分身</span>
                        <span className="text-[9px] font-bold opacity-60">训练个人销售大脑</span>
                    </button>

                    <button
                        onClick={() => setActiveSubTab('library')}
                        className={`relative z-10 flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 ${activeSubTab === 'library' ? 'text-gray-900 scale-105' : 'text-gray-400'}`}
                    >
                        <span className="text-[13px] font-black uppercase tracking-tight">专家库列表</span>
                        <span className="text-[9px] font-bold opacity-60">参考金牌销售话术</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                <div
                    className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${activeSubTab === 'create' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
                >
                    <DigitalHumanTrainingWorkshop />
                </div>
                <div
                    className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${activeSubTab === 'library' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
                >
                    <ExpertLibrary />
                </div>
            </div>
        </div>
    );
};

export default DigitalHumanSection;
