"use strict";
/**
 * GLM API Client
 * 智谱AI GLM模型客户端
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLMClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * GLM 客户端类
 */
class GLMClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
        this.model = config.model || 'glm-4.5-air';
    }
    /**
     * 流式完成请求（实际上返回完整响应，模拟流式）
     */
    async completeStream(options) {
        const url = `${this.baseURL}/chat/completions`;
        const requestBody = {
            model: this.model,
            messages: options.messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 1000,
            stream: false, // 简化实现，不使用真正的流式
        };
        try {
            const response = await (0, node_fetch_1.default)(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`GLM API error: ${response.status} ${errorText}`);
            }
            const data = await response.json();
            // 提取响应内容
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            }
            throw new Error('GLM API returned empty response');
        }
        catch (error) {
            console.error('[GLMClient] Request failed:', error.message);
            throw error;
        }
    }
    /**
     * 普通完成请求
     */
    async complete(options) {
        return this.completeStream(options);
    }
}
exports.GLMClient = GLMClient;
