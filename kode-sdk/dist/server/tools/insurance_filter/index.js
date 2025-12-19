"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceFilter = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.InsuranceFilter = (0, src_1.defineTool)({
    name: 'insurance_filter',
    description: prompt_1.DESCRIPTION,
    params: {
        age_min: {
            type: 'number',
            description: 'Minimum age (e.g. 0)',
        },
        age_max: {
            type: 'number',
            description: 'Maximum age (e.g. 100)',
        },
        product_type: {
            type: 'string',
            enum: ['定期寿险', '重疾险', '医疗险', '意外险'],
            description: 'Product type exact match',
        },
    },
    async exec(args) {
        const { age_min, age_max, product_type } = args;
        const url = new URL('http://localhost:8000/api/tools/filter');
        if (age_min !== undefined)
            url.searchParams.append('age_min', age_min.toString());
        if (age_max !== undefined)
            url.searchParams.append('age_max', age_max.toString());
        if (product_type)
            url.searchParams.append('product_type', product_type);
        try {
            const response = await (0, node_fetch_1.default)(url.toString());
            if (!response.ok) {
                return { ok: false, error: `API Error: ${response.statusText}` };
            }
            const data = await response.json();
            return {
                ok: true,
                count: data.count !== undefined ? data.count : (Array.isArray(data.products) ? data.products.length : 0),
                products: data.products
            };
        }
        catch (e) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});
exports.InsuranceFilter.prompt = prompt_1.PROMPT;
