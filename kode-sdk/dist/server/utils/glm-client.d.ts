/**
 * GLM API Client
 * 智谱AI GLM模型客户端
 */
export interface GLMClientConfig {
    apiKey: string;
    baseURL?: string;
    model?: string;
}
export interface GLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface GLMCompleteOptions {
    messages: GLMMessage[];
    temperature?: number;
    max_tokens?: number;
}
/**
 * GLM 客户端类
 */
export declare class GLMClient {
    private apiKey;
    private baseURL;
    private model;
    constructor(config: GLMClientConfig);
    /**
     * 流式完成请求（实际上返回完整响应，模拟流式）
     */
    completeStream(options: GLMCompleteOptions): Promise<string>;
    /**
     * 普通完成请求
     */
    complete(options: GLMCompleteOptions): Promise<string>;
}
