import { defineTool } from '../../../src';
import { DESCRIPTION, PROMPT } from './prompt';
import fetch from 'node-fetch';
import { API_CONFIG } from '../config';

export const GetCurrentClientProfile = defineTool({
    name: 'get_client_profile',
    description: DESCRIPTION,
    params: {
        // 允许按名字搜索，若不填则默认获取当前会话关联的客户
        name: { type: 'string', required: false }
    },
    async exec(args: any, context: any) {
        console.log(`[GetClientProfile] 🚀 开始执行, Args:`, args, `SessionId:`, context.sessionId);

        const explicitName = args.name;

        let url;

        if (explicitName) {
            // 策略 A: 按名字搜索
            const searchUrl = new URL(`${API_CONFIG.BASE_URL}/api/v1/clients/search`);
            searchUrl.searchParams.append('keyword', explicitName);
            url = searchUrl.toString();
            console.log(`[Lookup] 使用名字搜索: ${explicitName}`);
        } else {
            // 策略 C: 默认查当前会话 (Session Context)
            const sessionId = context.sessionId;
            if (!sessionId) {
                return { ok: false, error: "未找到会话ID且未提供客户参数。" };
            }
            url = `${API_CONFIG.BASE_URL}/api/v1/clients/session/${sessionId}`;
            console.log(`[Lookup] 使用会话查询: ${sessionId}`);
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return {
                        ok: true, // 404算正常结果，只要工具本身没崩
                        client_found: false,
                        message: "未找到该客户档案。"
                    };
                }
                return { ok: false, error: `API Error: ${response.statusText}` };
            }

            const data = await response.json() as any;

            // 兼容不同的后端返回结构 (Search可能返回数组, Detail返回对象)
            let clientProfile = data.client || data;
            if (Array.isArray(data) && data.length > 0) clientProfile = data[0];
            if (data.results && data.results.length > 0) clientProfile = data.results[0];

            if (!clientProfile || (!clientProfile.id && !clientProfile.name)) {
                return { ok: true, client_found: false, message: "返回数据为空或无效。" };
            }

            return {
                ok: true,
                client_found: true,
                profile: clientProfile
            };

        } catch (e: any) {
            return { ok: false, error: `Connection failed: ${e.message}` };
        }
    },
});

(GetCurrentClientProfile as any).prompt = PROMPT;
