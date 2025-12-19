"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceInspectToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
exports.insuranceInspectToolRegistration = {
    metadata: {
        name: 'insurance_inspect',
        description: '查看特定产品的详细字段（支持 lazy loading 和结构化提取）',
        category: types_1.ToolCategory.DATABASE,
    },
    tool: index_1.InsuranceInspect,
};
