import React, { useState } from 'react';
import ExpertLibrary from '../components/ExpertLibrary';
import AgentTrainingWorkshop from '../components/AgentTrainingWorkshop';

const ExpertListPage: React.FC = () => {
    const [view, setView] = useState<'workshop' | 'library'>('workshop');

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#F7F8FA]">
            {/* View Toggle */}
            <div className="bg-white px-5 pt-4 pb-2 z-30 shrink-0">
                <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1 shadow-inner">
                    <button
                        onClick={() => setView('workshop')}
                        className={`flex-1 py-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${view === 'workshop'
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        定向训练分身
                    </button>
                    <button
                        onClick={() => setView('library')}
                        className={`flex-1 py-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${view === 'library'
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        保险专家库
                    </button>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {view === 'workshop' ? <AgentTrainingWorkshop /> : <ExpertLibrary />}
            </div>
        </div>
    );
};

export default ExpertListPage;
