import React from 'react';

interface ExclusionBoxProps {
    exclusions: string[];
    coolingOffPeriod?: string;
}

const ExclusionBox: React.FC<ExclusionBoxProps> = ({
    exclusions,
    coolingOffPeriod = '自您签收保单之日起有 15 天犹豫期，期间退保无损失。'
}) => {
    return (
        <>
            {/* Exclusions */}
            <div className="bg-red-50 border border-dashed border-red-200 rounded-lg p-4 mb-4">
                <div className="font-semibold text-gray-700 mb-2">⚠️ 责任免除摘要</div>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {exclusions.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Cooling off period */}
            <p className="text-sm text-gray-500">
                犹豫期：{coolingOffPeriod}
            </p>
        </>
    );
};

export default ExclusionBox;
