import React from 'react';

const FilterBar: React.FC = () => {
    return (
        <div className="bg-white sticky top-[108px] z-10 border-b border-gray-100 pb-2">
            <div className="flex overflow-x-auto gap-2 px-5 pb-3 no-scrollbar">
                <button className="filter-pill-active px-4 py-1.5 rounded-full text-xs whitespace-nowrap shadow-sm">全部</button>
                <button className="filter-pill-inactive px-4 py-1.5 rounded-full text-xs whitespace-nowrap">高净值</button>
                <button className="filter-pill-inactive px-4 py-1.5 rounded-full text-xs whitespace-nowrap">企业主</button>
                <button className="filter-pill-inactive px-4 py-1.5 rounded-full text-xs whitespace-nowrap">理赔专家</button>
            </div>
            <div className="flex gap-6 px-6 text-xs font-medium text-gray-500 pt-1">
                <span className="text-orange-600 font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-orange-500 after:rounded-full">综合推荐</span>
                <span>咨询量</span>
                <span>案例数</span>
                <span>从业年限</span>
            </div>
        </div>
    );
};

export default FilterBar;
