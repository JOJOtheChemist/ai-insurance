import { Message, ContentBlock } from '../core/types';
import { Configurable } from '../core/config';
export interface ModelResponse {
    role: 'assistant';
    content: ContentBlock[];
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
    stop_reason?: string;
}
export interface ModelStreamChunk {
    type: 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop';
    index?: number;
    content_block?: ContentBlock;
    delta?: {
        type: 'text_delta' | 'input_json_delta';
        text?: string;
        partial_json?: string;
    };
    usage?: {
        output_tokens: number;
    };
}
export interface ModelConfig {
    provider: 'anthropic' | string;
    model: string;
    baseUrl?: string;
    apiKey?: string;
    maxTokens?: number;
    temperature?: number;
}
export interface ModelProvider extends Configurable<ModelConfig> {
    readonly model: string;
    readonly maxWindowSize: number;
    readonly maxOutputTokens: number;
    readonly temperature: number;
    complete(messages: Message[], opts?: {
        tools?: any[];
        maxTokens?: number;
        temperature?: number;
        system?: string;
        stream?: boolean;
    }): Promise<ModelResponse>;
    stream(messages: Message[], opts?: {
        tools?: any[];
        maxTokens?: number;
        temperature?: number;
        system?: string;
    }): AsyncIterable<ModelStreamChunk>;
}
export declare class AnthropicProvider implements ModelProvider {
    private apiKey;
    private baseUrl;
    readonly maxWindowSize = 200000;
    readonly maxOutputTokens = 4096;
    readonly temperature = 0.7;
    readonly model: string;
    private endpoint;
    constructor(apiKey: string, model?: string, baseUrl?: string);
    complete(messages: Message[], opts?: {
        tools?: any[];
        maxTokens?: number;
        temperature?: number;
        system?: string;
        stream?: boolean;
    }): Promise<ModelResponse>;
    stream(messages: Message[], opts?: {
        tools?: any[];
        maxTokens?: number;
        temperature?: number;
        system?: string;
    }): AsyncIterable<ModelStreamChunk>;
    private formatMessages;
    toConfig(): ModelConfig;
}
