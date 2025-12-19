"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceSearchToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
exports.insuranceSearchToolRegistration = {
    metadata: {
        name: 'insurance_search',
        description: '通过关键词搜索保险产品（支持语义和条款深度搜索）',
        category: types_1.ToolCategory.DATABASE,
    },
    tool: index_1.InsuranceSearch,
};
