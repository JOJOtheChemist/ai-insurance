
import React from 'react';
import { CopyButton } from './CopyButton';

export interface SalesPitchProps {
    data: {
        tone?: string;
        key_points?: string[];
        script: string;
    };
}

export const SalesPitchCard: React.FC<SalesPitchProps> = ({ data }) => {
    return (
        <div className="mt-4 p-4 bg-[#F0F7FF] border border-blue-100 rounded-[20px] shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs">
                    <i className="fa-solid fa-microphone-lines"></i>
                </div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">推荐沟通话术</span>
                {data.tone && (
                    <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        {data.tone}
                    </span>
                )}
            </div>

            {data.key_points && data.key_points.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {data.key_points.map((pt, i) => (
                        <span key={i} className="text-[10px] text-blue-500 font-medium flex items-center gap-1">
                            <i className="fa-solid fa-circle-check text-[8px]"></i> {pt}
                        </span>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-xl p-3 border border-blue-50 relative">
                <i className="fa-solid fa-quote-left absolute -top-2 -left-1 text-blue-200 text-sm opacity-50"></i>
                <p className="text-sm text-gray-700 italic leading-6 pr-6">
                    "{data.script}"
                </p>
                <div className="absolute bottom-1 right-2">
                    <CopyButton text={data.script} />
                </div>
            </div>
        </div>
    );
};
