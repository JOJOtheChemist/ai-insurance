import { defineTool } from '../../../src';
import { DESCRIPTION, PROMPT } from './prompt';
import fetch from 'node-fetch';

export const InsuranceFilter = defineTool({
    name: 'insurance_filter',
    description: DESCRIPTION,
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
    async exec(args: { age_min?: number; age_max?: number; product_type?: string }) {
        const { age_min, age_max, product_type } = args;

        const url = new URL('http://localhost:8000/api/tools/filter');
        if (age_min !== undefined) url.searchParams.append('age_min', age_min.toString());
        if (age_max !== undefined) url.searchParams.append('age_max', age_max.toString());
        if (product_type) url.searchParams.append('product_type', product_type);

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                return { ok: false, error: `API Error: ${response.statusText}` };
            }
            const data = await response.json() as any;
            return {
                ok: true,
                count: data.count !== undefined ? data.count : (Array.isArray(data.products) ? data.products.length : 0),
                products: data.products
            };
        } catch (e: any) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});

(InsuranceFilter as any).prompt = PROMPT;
