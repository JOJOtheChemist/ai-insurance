
import { defineTool } from '../../../src';
import fetch from 'node-fetch';
import { API_CONFIG } from '../config';

const PROMPT = `Use this tool to submit a structured insurance plan/proposal for the client.
Use this when you have gathered enough information and are ready to recommend specific products or a combination of products.

Thinking Process:
1. Search for suitable products using 'insurance_search' or 'insurance_filter' first.
2. Formulate a plan (e.g., "Family Protection Plan").
3. Submit the plan using this tool.

The backend will store this plan and the frontend will display it in the "Recommended Schemes" section.
`;

export const SubmitInsurancePlan = defineTool({
    name: 'submit_insurance_plan',
    description: 'Submit a recommended insurance plan (scheme) for the client.',
    params: {
        targetClient: {
            type: 'string',
            description: 'The name of the client this plan is for (e.g., "王总").',
        },
        plan: {
            type: 'object',
            description: 'The full plan details.',
            properties: {
                title: { type: 'string', description: 'Plan title (e.g., "王总家庭全方位保障计划")' },
                tag: { type: 'string', description: 'Short tag (e.g., "主力方案", "重疾优先")' },
                budget: { type: 'string', description: 'Total budget text (e.g., "8.2万")' },
                description: { type: 'string', description: 'Short description of the plan focus.' },
                products: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Product Name' },
                            coverage: { type: 'string', description: 'Coverage amount/details (e.g. "50-100万")' },
                            reason: { type: 'string', description: 'Reason for recommendation' },
                            type: { type: 'string', description: '"main" (required) or "optional" (suggested)' }
                        }
                    }
                }
            }
        },
        reasoning: {
            type: 'string',
            description: 'Overall reasoning for this plan choice to show in the chat summary.',
        }
    },
    async exec(args: any, context: any) {
        const { targetClient, plan, reasoning } = args;
        const sessionId = context.sessionId;

        // 🔍 Auto-lookup Product IDs
        try {
            // 1. Fetch all products to match against
            // In a real production scenario, you might want to search by name individually or use a search API
            // For now, we fetch the list to do an in-memory match which is faster for small datasets
            const productRes = await fetch(`${API_CONFIG.BASE_URL}/api/products`);
            if (productRes.ok) {
                const productsData = await productRes.json() as any;
                const allProducts = productsData.data || [];

                // 2. Iterate and match
                if (plan.products && Array.isArray(plan.products)) {
                    plan.products = plan.products.map((p: any) => {
                        // If ID already exists, skip
                        if (p.id || p.product_id) return p;

                        // fuzzy match mechanism could be added here, for now use exact or partial inclusion
                        const match = allProducts.find((dbProd: any) =>
                            dbProd.name === p.name ||
                            dbProd.name.includes(p.name) ||
                            p.name.includes(dbProd.name)
                        );

                        if (match) {
                            console.log(`✅ [Auto-Match] Found ID for product "${p.name}": ${match.id}`);
                            return { ...p, id: match.id, product_id: match.id };
                        }

                        console.warn(`⚠️ [Auto-Match] No ID found for product "${p.name}"`);
                        return p;
                    });
                }
            }
        } catch (err) {
            console.error('❌ Failed to auto-lookup product IDs:', err);
            // Continue execution even if lookup fails
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/clients/submit-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    targetClient,
                    plan,
                    reasoning
                })
            });

            if (!response.ok) {
                const text = await response.text();
                return { ok: false, error: `API Error: ${text}` };
            }

            const result = await response.json();
            return {
                ok: true,
                message: `Plan "${plan.title}" submitted successfully for client ${result.client_id}.`,
                plan_id: result.plan_id
            };
        } catch (e: any) {
            return { ok: false, error: `Network error: ${e.message}` };
        }
    }
});

(SubmitInsurancePlan as any).prompt = PROMPT;
