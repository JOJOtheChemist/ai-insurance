import React from 'react';

// Configuration for feature labels (matching HTML template)
const MEDICAL_LABELS: Record<string, any> = {
    basic_rules: {
        title: "1. 基础投保规则",
        fields: {
            age_limit: "投保年龄",
            insurance_period: "保障期限",
            payment_period: "缴费年限",
            guaranteed_renewal: "保证续保",
            max_renewal_age: "最高续保年龄",
            occupation_limit: "职业限制",
            waiting_period: "等待期",
            hesitation_period: "犹豫期",
            smart_underwriting: "智能核保"
        }
    },
    hospitalization: {
        title: "2. 住院医疗保障",
        fields: {
            general_quota: "一般医疗保额",
            critical_illness_quota: "重疾医疗保额",
            deductible: "年度免赔额",
            reimbursement_rate: "赔付比例",
            pre_post_hospitalization: "住院前后门急诊",
            critical_illness_allowance: "重疾住院津贴",
            special_outpatient: "特殊门诊",
            outpatient_surgery: "门诊手术"
        }
    },
    special_coverage: {
        title: "3. 特药与高端医疗保障",
        fields: {
            external_drugs: "院外特药保障",
            drug_types: "特药种类数量",
            proton_heavy_ion: "质子重离子",
            designated_medical_equipment: "指定医疗器械"
        }
    },
    value_added_services: {
        title: "4. 增值服务",
        is_list: true
    },
    renewal_exclusions: {
        title: "5. 续保与免责",
        fields: {
            renewal_conditions: "续保条件",
            pre_existing_conditions: "既往症约定",
            main_exclusions: "主要免责条款"
        }
    }
};

const ILLNESS_LABELS: Record<string, any> = {
    basic_rules: {
        title: "1. 基础投保规则",
        fields: {
            age_limit: "投保年龄",
            insurance_period: "保障期限",
            waiting_period: "等待期",
            hesitation_period: "犹豫期"
        }
    },
    heavy_illness: {
        title: "2. 重疾保障",
        fields: {
            disease_count: "病种数量",
            payout_times: "赔付次数",
            payout_ratio: "赔付比例",
            extra_payout: "额外赔付"
        }
    },
    medium_light_illness: {
        title: "3. 中/轻症保障",
        fields: {
            medium_count: "中症病种",
            medium_payout: "中症赔付",
            light_count: "轻症病种",
            light_payout: "轻症赔付",
            waiver: "被保人豁免"
        }
    },
    waiver: {
        title: "豁免保障",
        fields: {
            waiver_conditions: "豁免条件"
        }
    },
    death_disability: {
        title: "4. 身故/全残保障",
        fields: {
            death_payout: "身故赔付",
            disability_payout: "全残赔付"
        }
    },
    optional_features: {
        title: "5. 特色权益",
        is_list: true
    }
};

const ACCIDENT_LABELS: Record<string, any> = {
    basic_rules: {
        title: "1. 基础投保规则",
        fields: {
            age_limit: "投保年龄",
            insurance_period: "保障期限",
            payment_period: "缴费方式",
            waiting_period: "等待期"
        }
    },
    accident_protection: {
        title: "2. 意外保障",
        fields: {
            death_payout: "意外身故",
            disability_payout: "意外伤残",
            sudden_death: "猝死保障",
            general_accident: "一般意外",
            specific_accident: "特定意外"
        }
    },
    medical_protection: {
        title: "3. 意外医疗",
        fields: {
            medical_expense: "医疗费用",
            bone_fracture: "骨折津贴",
            allowance: "住院津贴"
        }
    },
    other_rights: {
        title: "其他权益",
        fields: {
            surrender_terms: "退保规则"
        }
    }
};

const LIFE_LABELS: Record<string, any> = {
    basic_rules: {
        title: "1. 基础投保规则",
        fields: {
            age_limit: "投保年龄",
            insurance_period: "保障期限",
            payment_period: "缴费年限",
            waiting_period: "等待期",
            hesitation_period: "犹豫期"
        }
    },
    death_disability: {
        title: "2. 身故/全残保障",
        fields: {
            death_payout: "身故赔付",
            disability_payout: "全残赔付",
            accidental_extra: "意外额外赔"
        }
    },
    maturity_benefits: {
        title: "3. 满期权益",
        fields: {
            maturity_payout: "满期金"
        }
    },
    other_rights: {
        title: "4. 其他权益",
        fields: {
            surrender_terms: "退保规则",
            dividend: "保单分红"
        }
    }
};

const PENSION_LABELS: Record<string, any> = {
    basic_rules: {
        title: "1. 基础投保规则",
        fields: {
            age_limit: "投保年龄",
            insurance_period: "保障期限",
            payment_period: "缴费年限",
            waiting_period: "等待期",
            hesitation_period: "犹豫期"
        }
    },
    pension_collection: {
        title: "2. 年金领取",
        fields: {
            start_collection: "起领时间",
            collection_method: "领取方式",
            pension_amount: "领取金额",
            maturity_payout: "满期金"
        }
    },
    death_benefit: {
        title: "3. 身故保障",
        fields: {
            death_payout: "身故赔付"
        }
    },
    other_rights: {
        title: "4. 其他权益",
        fields: {
            surrender_terms: "退保规则",
            dividend: "保单分红"
        }
    }
};

interface StructuredCoverageProps {
    features: Record<string, any>;
    type: 'medical' | 'illness' | 'accident' | 'life' | 'pension';
}

const StructuredCoverage: React.FC<StructuredCoverageProps> = ({ features, type }) => {
    let labelsConfig = MEDICAL_LABELS;
    switch (type) {
        case 'illness': labelsConfig = ILLNESS_LABELS; break;
        case 'accident': labelsConfig = ACCIDENT_LABELS; break;
        case 'life': labelsConfig = LIFE_LABELS; break;
        case 'pension': labelsConfig = PENSION_LABELS; break;
        default: labelsConfig = MEDICAL_LABELS;
    }

    if (!features) return null;

    return (
        <div className="space-y-4">
            {Object.keys(labelsConfig).map((key) => {
                const config = labelsConfig[key];
                const data = features[key];

                if (!data) return null;

                return (
                    <div key={key} className="bg-white rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-2">
                            {config.title}
                        </h4>

                        {config.is_list ? (
                            Array.isArray(data) && data.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {data.map((item: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )
                        ) : (
                            <table className="w-full text-sm border-collapse rounded-lg overflow-hidden ring-1 ring-gray-100">
                                <tbody>
                                    {Object.keys(config.fields).map((fieldKey) => {
                                        if (data[fieldKey]) {
                                            return (
                                                <tr key={fieldKey} className="border-b border-gray-100 last:border-0">
                                                    <td className="w-[40%] text-gray-500 bg-gray-50/50 p-2.5">
                                                        {config.fields[fieldKey]}
                                                    </td>
                                                    <td className="font-semibold text-gray-800 p-2.5">
                                                        {data[fieldKey]}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StructuredCoverage;
