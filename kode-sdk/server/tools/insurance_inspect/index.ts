import { defineTool } from '../../../src';
import { DESCRIPTION, PROMPT } from './prompt';
import fetch from 'node-fetch';

export const InsuranceInspect = defineTool({
    name: 'insurance_inspect',
    description: DESCRIPTION,
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
    async exec(args: { product_id: number; fields: string; view?: string }) {
        const { product_id, fields, view = 'full' } = args;

        const url = new URL('http://localhost:8000/api/tools/inspect');
        url.searchParams.append('product_id', product_id.toString());
        url.searchParams.append('fields', fields);
        url.searchParams.append('view', view);

        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
                try {
                    const errorJson = await response.json() as any;
                    return { ok: false, error: errorJson.detail || response.statusText };
                } catch {
                    return { ok: false, error: `API Error: ${response.statusText}` };
                }
            }
            const data = await response.json() as any;
            return {
                ok: true,
                data: data
            };
        } catch (e: any) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});

(InsuranceInspect as any).prompt = PROMPT;
