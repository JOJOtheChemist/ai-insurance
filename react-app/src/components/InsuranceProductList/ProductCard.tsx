import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Metric {
    label: string;
    value: string;
    isHighlighted?: boolean;
}

interface ProductCardProps {
    id: number;
    company: string;
    name: string;
    companyColor: string;
    companyInitial: string;
    badge?: string;
    tags?: string[];
    metrics?: Metric[];
    onCompareToggle: (checked: boolean) => void;
    onMakeProposal: () => void;
    isSelected?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    company,
    name,
    companyColor,
    companyInitial,
    badge,
    tags,
    metrics,
    onCompareToggle,
    onMakeProposal,
    isSelected
}) => {
    const navigate = useNavigate();
    return (
        <div className="product-card bg-white rounded-[20px] p-4 relative overflow-hidden transition-all duration-100 active:scale-[0.99] border-2 border-transparent hover:border-orange-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Top Section: Company Info & Badge */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${companyColor}`}>
                        {companyInitial}
                    </div>
                    <span className="text-xs font-bold text-gray-500">{company}</span>
                </div>
                {badge && (
                    <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                        {badge} 🔥
                    </span>
                )}
            </div>

            {/* Main Info: Title & Tags */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1">
                    {name}
                </h3>
                {tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${idx === 0
                                    ? 'text-orange-600 bg-orange-50 border-orange-100'
                                    : 'text-gray-500 bg-gray-100 border-transparent'
                                    }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Metrics Section: Grid logic to stretch */}
            {metrics && (
                <div className={`grid gap-2 mb-3 ${metrics.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-[#F9FAFB] rounded-lg p-2 flex flex-col justify-center min-h-[56px]">
                            <div className="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                {metric.label}
                            </div>
                            <div className={`text-base leading-tight ${metric.isHighlighted ? 'font-black text-orange-600' : 'font-bold text-gray-800'}`}>
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Bar: Comparison, AI Analysis & Proposal */}
            <div className="border-t border-[#F3F4F6] mt-3 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none shrink-0">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onCompareToggle(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                        />
                        加入对比
                    </label>

                    <div className="flex flex-1 gap-2">
                        <button
                            onClick={() => navigate('/composite-chat-full')}
                            className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i> AI 卖点
                        </button>
                        <button
                            onClick={onMakeProposal}
                            className="flex-1 bg-gray-900 text-white py-2.5 rounded-full text-[11px] font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                        >
                            <i className="fa-solid fa-file-signature text-xs"></i> 制作计划书
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
