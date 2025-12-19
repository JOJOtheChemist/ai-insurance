"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceFilterToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
exports.insuranceFilterToolRegistration = {
    metadata: {
        name: 'insurance_filter',
        description: '根据年龄、险种类型精确筛选保险产品',
        category: types_1.ToolCategory.DATABASE, // Categorizing as Database since it queries product DB
    },
    tool: index_1.InsuranceFilter,
};
