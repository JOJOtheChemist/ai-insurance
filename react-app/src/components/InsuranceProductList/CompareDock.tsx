import React from 'react';

interface CompareDockProps {
    selectedCount: number;
    active: boolean;
    onAiCompare?: () => void;
}

const CompareDock: React.FC<CompareDockProps> = ({ selectedCount, active, onAiCompare }) => {
    return (
        <div
            className={`fixed bottom-24 left-50-percent translate-x--50-percent w-[90%] max-w-[400px] bg-gray-900 text-white rounded-full py-2 px-3 pl-5 flex items-center justify-between shadow-2xl z-50 transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1) ${active ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'
                }`}
            style={{ left: '50%', transform: active ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(150%)' }}
        >
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-300">已选 {selectedCount} 款产品</span>
                <span className="text-[10px] text-gray-500 font-medium">可对比条款与收益</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onAiCompare}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-900/50"
                >
                    <i className="fa-solid fa-robot"></i> AI 分析
                </button>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors">
                    生成表格
                </button>
            </div>
        </div>
    );
};

export default CompareDock;
