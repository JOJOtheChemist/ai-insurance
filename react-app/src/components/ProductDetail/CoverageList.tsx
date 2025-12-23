import React from 'react';
import type { CoverageItem } from './ProductHeader';

interface CoverageListProps {
    items: CoverageItem[];
}

const CoverageList: React.FC<CoverageListProps> = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
            <h3 className="text-lg font-bold mb-4 flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                核心保障权益
            </h3>
            <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start py-4 first:pt-0 last:pb-0">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-red-500">
                            <i className={`${item.icon} text-lg`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        </div>
                        <div className="font-bold text-red-600 ml-3 whitespace-nowrap">
                            {item.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoverageList;
