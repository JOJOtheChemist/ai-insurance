"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '精确过滤保险产品 (Filter)';
exports.PROMPT = `Use this tool to filter insurance products based on hard criteria.
This tool is best used for PRECISE filtering when you have specific constraints.

Supported parameters:
- age_min / age_max: Filter by detailed age range (e.g. 18-60). The system supports smart parsing of age strings.
- product_type: Exact match for product type (e.g. "重疾险", "医疗险", "定期寿险", "意外险").

Best Practice:
- Use this as the FIRST step to narrow down the pool of 40+ products.
- If the user provides a specific age (e.g. "30 years old"), ALWAYS use age_min=30, age_max=30.`;
