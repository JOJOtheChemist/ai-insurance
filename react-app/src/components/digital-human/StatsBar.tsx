import React from 'react';

const StatsBar: React.FC = () => {
    return (
        <div className="flex justify-around mt-5 px-5 text-center">
            <div>
                <div className="text-lg font-bold text-gray-900">5.2w</div>
                <div className="text-[10px] text-gray-400">咨询次数</div>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div>
                <div className="text-lg font-bold text-gray-900">98%</div>
                <div className="text-[10px] text-gray-400">好评率</div>
            </div>
            <div className="w-px h-8 bg-gray-100"></div>
            <div>
                <div className="text-lg font-bold text-orange-500">128</div>
                <div className="text-[10px] text-gray-400">精选案例</div>
            </div>
        </div>
    );
};

export default StatsBar;
