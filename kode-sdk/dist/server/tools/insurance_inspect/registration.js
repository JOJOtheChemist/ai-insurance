"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceInspectToolRegistration = void 0;
const types_1 = require("../types");
const index_1 = require("./index");
exports.insuranceInspectToolRegistration = {
    metadata: {
        name: 'insurance_inspect',
        description: '查看特定【商业保险产品】的条款与详情（严禁用于查客户档案）',
        category: types_1.ToolCategory.DATABASE,
    },
    tool: index_1.InsuranceInspect,
};
