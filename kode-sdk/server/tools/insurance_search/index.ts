import { defineTool } from '../../../src';
import { DESCRIPTION, PROMPT } from './prompt';
import fetch from 'node-fetch';
import { API_CONFIG } from '../config';

export const InsuranceSearch = defineTool({
    name: 'insurance_search',
    description: DESCRIPTION,
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
    async exec(args: { keyword: string; limit?: number }) {
        const { keyword, limit = 5 } = args;

        const url = new URL(`${API_CONFIG.BASE_URL}/api/tools/search`);
        url.searchParams.append('keyword', keyword);
        url.searchParams.append('limit', limit.toString());

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                return { ok: false, error: `API Error: ${response.statusText}` };
            }
            const data = await response.json() as any;
            return {
                ok: true,
                products: data.products
            };
        } catch (e: any) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});

(InsuranceSearch as any).prompt = PROMPT;
