import { defineTool } from '../../../src';
import { DESCRIPTION, PROMPT } from './prompt';
import fetch from 'node-fetch';
import { API_CONFIG } from '../config';

export const UpdateClientIntelligence = defineTool({
    name: 'update_client_intelligence',
    description: DESCRIPTION,
    params: {
        targetClient: {
            type: 'string',
            description: 'The name of the client to update (e.g. "王先生", "张女士"). Required for multi-client sessions.',
        },
        clientId: {
            type: 'number',
            description: 'Optional. Direct client ID if known.',
        },
        profileUpdates: {
            type: 'object',
            description: 'Fields to update: name, role, age, annual_budget, risk_factors[], needs[], resistances[].',
        },
        familyMembers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    relation: { type: 'string', description: '本人, 配偶, 子女, 父母' },
                    name: { type: 'string' },
                    age: { type: 'number' },
                    status: { type: 'string', description: '已投保, 缺口, 正在配置' }
                }
            },
            description: 'Discovered family members.',
        },
        followUpSummary: {
            type: 'string',
            description: 'Concise summary of this interaction segment.',
        }
    },
    async exec(args: any, context: any) {
        console.log(`[UpdateClientIntelligence] 🚀 开始执行:`, JSON.stringify(args, null, 2));
        console.log(`[UpdateClientIntelligence] Context keys:`, Object.keys(context));
        console.log(`[UpdateClientIntelligence] SessionId in context:`, context.sessionId);
        const { targetClient, clientId, profileUpdates, familyMembers, followUpSummary } = args;
        const sessionId = context.sessionId;
        const userId = context.userId;

        const salespersonId = 1;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/clients/update-intelligence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetClient,
                    clientId,
                    sessionId: sessionId,
                    salespersonId: salespersonId,
                    profileUpdates,
                    familyMembers,
                    followUpSummary
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                return { ok: false, error: `API Error (${response.status}): ${errText}` };
            }

            const result = await response.json();
            return {
                ok: true,
                message: `Intelligence updated for client ${result.client_id} (linked to session ${result.linked_session}).`,
                clientId: result.client_id
            };
        } catch (e: any) {
            return { ok: false, error: `Connection to insurance-api failed: ${e.message}` };
        }
    },
});

(UpdateClientIntelligence as any).prompt = PROMPT;
