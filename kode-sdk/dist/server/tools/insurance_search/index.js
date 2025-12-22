"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceSearch = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
exports.InsuranceSearch = (0, src_1.defineTool)({
    name: 'insurance_search',
    description: prompt_1.DESCRIPTION,
    params: {
        keyword: {
            type: 'string',
            description: 'Search keyword (e.g. "sudden death")',
        },
        limit: {
            type: 'number',
            description: 'Max results to return (default: 5)',
        },
    },
    async exec(args) {
        const { keyword, limit = 5 } = args;
        const url = new URL(`${config_1.API_CONFIG.BASE_URL}/api/tools/search`);
        url.searchParams.append('keyword', keyword);
        url.searchParams.append('limit', limit.toString());
        try {
            const response = await (0, node_fetch_1.default)(url.toString());
            if (!response.ok) {
                return { ok: false, error: `API Error: ${response.statusText}` };
            }
            const data = await response.json();
            return {
                ok: true,
                products: data.products
            };
        }
        catch (e) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});
exports.InsuranceSearch.prompt = prompt_1.PROMPT;
