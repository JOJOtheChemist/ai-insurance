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
        // clientId removed to prevent LLM hallucination
        profileUpdates: {
            type: 'object',
            description: 'Fields to update: name, role, age, annual_budget, risk_factors[], needs[], resistances[].',
        },
        contacts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    role: { type: 'string' },
                    type: { type: 'string', description: 'secretary, finance, doctor, etc.' },
                    contact_info: { type: 'string', description: 'WeChat, email, etc.' },
                    actions: { type: 'array', items: { type: 'string' } }
                }
            },
            description: 'Common contacts discovered.',
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
        const { targetClient, profileUpdates, contacts, familyMembers, followUpSummary } = args;
        const sessionId = context.sessionId;
        const userId = context.userId;

        const salespersonId = 1;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/clients/update-intelligence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetClient,
                    // clientId removed
                    sessionId: sessionId,
                    salespersonId: salespersonId,
                    profileUpdates: {
                        ...(profileUpdates || {}),
                        contacts: contacts || (profileUpdates || {}).contacts
                    },
                    familyMembers,
                    followUpSummary
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                return { ok: false, error: `API Error (${response.status}): ${errText}` };
            }

            const result = await response.json() as any;

            return {
                message: `成功同步客户投保画像。客户ID: ${result.client_id || '未知'}, 会话: ${result.linked_session || sessionId}`,
                data: result
            };
        } catch (e: any) {
            return { ok: false, error: `Connection to insurance-api failed: ${e.message}` };
        }
    },
});

(UpdateClientIntelligence as any).prompt = PROMPT;
