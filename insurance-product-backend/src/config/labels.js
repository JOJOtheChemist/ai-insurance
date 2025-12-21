// 医疗险标签配置
export const MEDICAL_LABELS = {
  basic_rules: {
    title: "1. 基础投保规则",
    fields: {
      age_limit: "投保年龄",
      insurance_period: "保障期限",
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
}

// 意外保障标签配置
export const ACCIDENT_LABELS = {
  basic_rules: {
    title: "1. 基础投保规则",
    fields: {
      age_limit: "投保年龄",
      insurance_period: "保障期限",
      payment_period: "缴费期限",
      waiting_period: "等待期",
      hesitation_period: "犹豫期"
    }
  },
  accident_protection: {
    title: "2. 意外身故/伤残",
    fields: {
      death_payout: "意外身故",
      disability_payout: "意外伤残",
      sudden_death: "猝死保障"
    }
  },
  transportation_accident: {
    title: "3. 交通意外额外赔",
    fields: {
      aviation_accident: "航空意外",
      train_accident: "轨道交通",
      ship_accident: "轮船意外",
      driving_accident: "驾乘意外"
    }
  },
  medical_protection: {
    title: "4. 意外医疗保障",
    fields: {
      medical_expense: "意外医疗",
      hospitalization_allowance: "住院津贴",
      bone_fracture: "意外骨折"
    }
  },
  other_protection: {
    title: "5. 其他保障",
    fields: {
      burns: "烧烫伤",
      vaccination: "预防接种",
      ambulance: "救护车费用"
    }
  }
}

// 重疾险标签配置
export const ILLNESS_LABELS = {
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
}

// 养老年金/年金险标签配置
export const PENSION_LABELS = {
  basic_rules: {
    title: "1. 基础投保规则",
    fields: {
      age_limit: "投保年龄",
      insurance_period: "保障期限",
      payment_period: "缴费期限",
      waiting_period: "等待期",
      hesitation_period: "犹豫期"
    }
  },
  pension_collection: {
    title: "2. 年金/满期领取",
    fields: {
      start_collection: "起领时间",
      pension_amount: "年金金额",
      maturity_payout: "满期金",
      collection_method: "领取方式"
    }
  },
  death_benefit: {
    title: "3. 身故保障",
    fields: {
      death_payout: "身故保险金"
    }
  },
  other_rights: {
    title: "4. 其他权益",
    fields: {
      dividend: "保单分红",
      surrender_terms: "退保规则",
      universal_account: "万能账户"
    }
  }
}

// 人寿保障（定期寿险/终身寿险/两全保险）标签配置
export const LIFE_LABELS = {
  basic_rules: {
    title: "1. 基础投保规则",
    fields: {
      age_limit: "投保年龄",
      insurance_period: "保障期限",
      payment_period: "缴费期限",
      waiting_period: "等待期",
      hesitation_period: "犹豫期"
    }
  },
  death_disability: {
    title: "2. 身故/全残保障",
    fields: {
      death_payout: "身故保险金",
      disability_payout: "全残保险金",
      accidental_extra: "意外额外赔",
      sudden_death: "猝死保障"
    }
  },
  maturity_benefits: {
    title: "3. 满期/生存权益",
    fields: {
      maturity_payout: "满期金",
      return_premium: "返还保费"
    }
  },
  other_rights: {
    title: "4. 其他权益",
    fields: {
      dividend: "保单分红",
      surrender_terms: "退保规则",
      policy_loan: "保单贷款",
      conversion_privilege: "年金转换"
    }
  }
}
