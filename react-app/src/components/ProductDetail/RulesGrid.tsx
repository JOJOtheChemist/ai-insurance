import React from 'react';

interface RulesGridProps {
    ageRange?: string;
    insurancePeriod?: string;
    waitingPeriod?: string;
    paymentMethod?: string;
}

const RulesGrid: React.FC<RulesGridProps> = ({
    ageRange = '0-70 周岁',
    insurancePeriod = '1 年',
    waitingPeriod = '30 天',
    paymentMethod = '年交'
}) => {
    const rules = [
        { label: '投保年龄', value: ageRange },
        { label: '保障期间', value: insurancePeriod },
        { label: '等待期', value: waitingPeriod },
        { label: '交费方式', value: paymentMethod },
    ];

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
            <h3 className="text-lg font-bold mb-4 flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                投保规则
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rules.map((rule, index) => (
                    <div key={index}>
                        <div className="text-xs text-gray-500 mb-1">{rule.label}</div>
                        <div className="text-sm font-semibold text-gray-900">{rule.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RulesGrid;
