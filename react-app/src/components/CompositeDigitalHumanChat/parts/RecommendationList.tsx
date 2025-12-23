
import React from 'react';
import { CopyButton } from './CopyButton';

export interface RecommendationListProps {
    recommendations: any[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
    return (
        <div className="mt-4 space-y-3 animate-fadeIn">
            <p className="text-xs font-bold text-orange-500 mb-2 pl-1 tracking-wider uppercase flex items-center gap-2">
                <i className="fa-solid fa-star"></i> 为您甄选的保险产品
            </p>
            <div className="space-y-3">
                {recommendations.map((prod, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-[20px] p-4 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-[#FFF9F2] text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-200 uppercase">
                                {prod.product_type}
                            </span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{prod.product_name}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed mb-3">{prod.customer_fit}</p>

                        {prod.recommendation_reason && (
                            <div className="mb-3 p-2 bg-orange-50 border border-orange-100 rounded-lg relative">
                                <p className="text-[10px] font-bold text-orange-400 mb-1 flex items-center gap-1">
                                    <i className="fa-solid fa-thumbs-up"></i> 核心推荐理由
                                </p>
                                <p className="text-xs text-gray-700 italic pr-6">
                                    "{prod.recommendation_reason}"
                                </p>
                                <div className="absolute top-1 right-1">
                                    <CopyButton text={prod.recommendation_reason} />
                                </div>
                            </div>
                        )}

                        {prod.coverage_highlights && (
                            <div className="flex flex-wrap gap-1.5">
                                {prod.coverage_highlights.map((h: string, i: number) => (
                                    <span key={i} className="bg-[#F0F7FF] text-blue-600 px-2 py-0.5 rounded-lg text-[10px] font-medium border border-blue-100 italic">
                                        #{h}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
