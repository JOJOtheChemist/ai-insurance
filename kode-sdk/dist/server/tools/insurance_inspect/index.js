"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceInspect = void 0;
const src_1 = require("../../../src");
const prompt_1 = require("./prompt");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../config");
exports.InsuranceInspect = (0, src_1.defineTool)({
    name: 'insurance_inspect',
    description: prompt_1.DESCRIPTION,
    params: {
        product_id: {
            type: 'number',
            description: 'Product ID',
        },
        fields: {
            type: 'string',
            description: 'Fields to retrieve (comma separated)',
        },
        view: {
            type: 'string',
            enum: ['full', 'summary'],
            description: 'View mode: "summary" for keys only, "full" for content (default: full)',
        },
    },
    async exec(args) {
        const { product_id, fields, view = 'full' } = args;
        const url = new URL(`${config_1.API_CONFIG.BASE_URL}/api/tools/inspect`);
        url.searchParams.append('product_id', product_id.toString());
        url.searchParams.append('fields', fields);
        url.searchParams.append('view', view);
        try {
            const response = await (0, node_fetch_1.default)(url.toString());
            if (!response.ok) {
                try {
                    const errorJson = await response.json();
                    return { ok: false, error: errorJson.detail || response.statusText };
                }
                catch {
                    return { ok: false, error: `API Error: ${response.statusText}` };
                }
            }
            const data = await response.json();
            return {
                ok: true,
                data: data
            };
        }
        catch (e) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});
exports.InsuranceInspect.prompt = prompt_1.PROMPT;
