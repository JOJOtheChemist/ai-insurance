import React, { useState } from 'react';

const ProductHeader: React.FC = () => {
    const [activeType, setActiveType] = useState('全部');
    const [activeCompany, setActiveCompany] = useState('全部');

    const types = ['全部', '重疾险', '终身寿', '百万医疗', '年金险', '意外险'];
    const companies = ['全部', '平安', '友邦', '人保', '泰康', '国寿'];

    return (
        <header className="bg-white/96 backdrop-blur-md sticky top-0 z-30 px-4 py-3 border-b border-gray-100 flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {/* Search Bar */}
            <div className="h-10 bg-gray-100 rounded-xl flex items-center px-3 border border-transparent focus-within:bg-white focus-within:border-orange-200 transition-all">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-2"></i>
                <input
                    type="text"
                    placeholder="搜索产品名称、条款关键字..."
                    className="bg-transparent text-sm flex-1 outline-none text-gray-700"
                />
                <i className="fa-solid fa-barcode text-gray-400 text-sm ml-2"></i>
            </div>

            {/* Filter Tabs - Types */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border ${activeType === type
                                    ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Filter Tabs - Companies */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    <span className="text-[11px] font-black text-gray-300 uppercase letter-wider shrink-0 mr-1">公司</span>
                    {companies.map((company) => (
                        <button
                            key={company}
                            onClick={() => setActiveCompany(company)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${activeCompany === company
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            {company}
                        </button>
                    ))}
                    <button className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg text-[11px] font-bold text-gray-400 border border-transparent hover:bg-gray-100 ml-1 whitespace-nowrap">
                        全部公司 <i className="fa-solid fa-caret-down text-[9px]"></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ProductHeader;
