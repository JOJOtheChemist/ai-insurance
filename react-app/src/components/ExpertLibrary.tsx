import React, { useState } from 'react';
import ExpertCard, { type ExpertProps } from './insurance/ExpertCard';

const experts: ExpertProps[] = [
    {
        id: 1,
        name: "张伟",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle",
        isAi: true,
        consultationCount: "5.2w",
        caseCount: 128,
        title: "友邦保险 | 资深区域总监",
        tags: [
            { label: "MDRT 终身会员", type: "gold" },
            { label: "家族信托", type: "gray" }
        ],
        casePreview: {
            icon: "fa-solid fa-book-open",
            category: "精选对话案例",
            title: "如何为5000万资产家庭设计传承架构？",
            themeColor: "orange"
        },
        buttonStyle: 'primary'
    },
    {
        id: 2,
        name: "李娜",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Li&style=circle&top=longHair",
        isAi: true,
        consultationCount: "3.8w",
        caseCount: 96,
        title: "平安人寿 | 营业部经理",
        tags: [
            { label: "TOT 顶尖会员", type: "gold" },
            { label: "女性财富", type: "pink" }
        ],
        casePreview: {
            icon: "fa-solid fa-comments",
            category: "精选对话案例",
            title: "单身女性如何配置重疾与养老金？",
            themeColor: "pink"
        },
        buttonStyle: 'outline'
    },
    {
        id: 3,
        name: "王峰",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wang2&style=circle",
        isAi: true,
        consultationCount: "1.9w",
        caseCount: 42,
        title: "中信保诚 | 法商顾问",
        tags: [
            { label: "信托专家", type: "gold" },
            { label: "跨境税务", type: "gray" }
        ],
        casePreview: {
            icon: "fa-solid fa-scale-balanced",
            category: "精选对话案例",
            title: "企业资产隔离的三个关键步骤",
            themeColor: "gray"
        },
        buttonStyle: 'outline'
    }
];

const ExpertLibrary: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('全部');
    const filters = ['全部', '高净值', '企业主', '理赔专家', '养老规划'];

    return (
        <div className="h-full flex flex-col bg-[#F7F8FA] overflow-hidden">
            {/* Filter Bar */}
            <div className="bg-white shrink-0 z-10 border-b border-gray-100 py-3 shadow-[0_2px_5px_rgba(0,0,0,0.02)]">
                <div className="flex overflow-x-auto gap-2 px-4 pb-3 no-scrollbar">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${activeFilter === filter
                                    ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm'
                                    : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex gap-6 px-6 text-[11px] font-black text-gray-300 uppercase letter-wider pt-1">
                    <span className="text-orange-600 font-black relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-0.5 after:bg-orange-500 after:rounded-full">综合推荐</span>
                    <span>咨询量</span>
                    <span>案例数</span>
                    <span>从业年限</span>
                </div>
            </div>

            {/* List */}
            <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 no-scrollbar">
                {experts.map(expert => (
                    <ExpertCard key={expert.id} {...expert} />
                ))}
            </main>
        </div>
    );
};

export default ExpertLibrary;
