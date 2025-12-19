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
