"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
class AnthropicProvider {
    constructor(apiKey, model = 'claude-3-5-sonnet-20241022', baseUrl = 'https://api.anthropic.com') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.maxWindowSize = 200000;
        this.maxOutputTokens = 4096;
        this.temperature = 0.7;
        this.model = model;
        // 🔥 如果 baseUrl 已包含完整端点，直接使用；否则添加 /v1/messages
        this.endpoint = (baseUrl.includes('/chat/completions') || baseUrl.includes('/v1/messages')) ? baseUrl : `${baseUrl}/v1/messages`;
    }
    async complete(messages, opts) {
        const body = {
            model: this.model,
            messages: this.formatMessages(messages),
            max_tokens: opts?.maxTokens || 4096,
        };
        if (opts?.temperature !== undefined)
            body.temperature = opts.temperature;
        if (opts?.system)
            body.system = opts.system;
        if (opts?.tools && opts.tools.length > 0)
            body.tools = opts.tools;
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Anthropic API error: ${response.status} ${error}`);
        }
        const data = await response.json();
        // 🔥 支持 OpenAI 格式（Z.AI）
        if (data.choices) {
            const choice = data.choices[0];
            const message = choice?.message;
            const content = [];
            // 优先使用 reasoning_content（思考内容）
            const textContent = message?.reasoning_content || message?.content;
            if (textContent) {
                content.push({ type: 'text', text: textContent });
            }
            // 处理工具调用
            if (message?.tool_calls) {
                for (const toolCall of message.tool_calls) {
                    content.push({
                        type: 'tool_use',
                        id: toolCall.id,
                        name: toolCall.function.name,
                        input: JSON.parse(toolCall.function.arguments || '{}'),
                    });
                }
            }
            return {
                role: 'assistant',
                content,
                usage: data.usage ? {
                    input_tokens: data.usage.prompt_tokens,
                    output_tokens: data.usage.completion_tokens,
                } : undefined,
                stop_reason: choice?.finish_reason || undefined,
            };
        }
        // 原生 Anthropic 格式
        return {
            role: 'assistant',
            content: data.content,
            usage: data.usage,
            stop_reason: data.stop_reason,
        };
    }
    async *stream(messages, opts) {
        const body = {
            model: this.model,
            messages: this.formatMessages(messages),
            max_tokens: opts?.maxTokens || 4096,
            stream: true,
        };
        if (opts?.temperature !== undefined)
            body.temperature = opts.temperature;
        if (opts?.system)
            body.system = opts.system;
        if (opts?.tools && opts.tools.length > 0)
            body.tools = opts.tools;
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Anthropic API error: ${response.status} ${error}`);
        }
        const reader = response.body?.getReader();
        if (!reader)
            throw new Error('No response body');
        const decoder = new TextDecoder();
        let buffer = '';
        let currentIndex = 0;
        let isFirstChunk = true;
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (!line.trim() || !line.startsWith('data: '))
                    continue;
                const data = line.slice(6);
                if (data === '[DONE]') {
                    yield { type: 'message_stop' };
                    continue;
                }
                try {
                    const event = JSON.parse(data);
                    // 🔥 支持 Anthropic 原生格式
                    if (event.type === 'content_block_start') {
                        yield { type: 'content_block_start', index: event.index, content_block: event.content_block };
                        isFirstChunk = false;
                    }
                    else if (event.type === 'content_block_delta') {
                        yield { type: 'content_block_delta', index: event.index, delta: event.delta };
                    }
                    else if (event.type === 'content_block_stop') {
                        yield { type: 'content_block_stop', index: event.index };
                    }
                    else if (event.type === 'message_delta') {
                        yield { type: 'message_delta', delta: event.delta, usage: event.usage };
                    }
                    else if (event.type === 'message_stop') {
                        yield { type: 'message_stop' };
                    }
                    // 🔥 支持 OpenAI 兼容格式（Z.AI）
                    else if (event.choices) {
                        const choice = event.choices[0];
                        if (!choice)
                            continue;
                        const delta = choice.delta;
                        // 优先使用 reasoning_content（思考内容）
                        const textContent = delta.reasoning_content || delta.content || '';
                        if (textContent) {
                            if (isFirstChunk) {
                                yield {
                                    type: 'content_block_start',
                                    index: currentIndex,
                                    content_block: { type: 'text', text: '' },
                                };
                                isFirstChunk = false;
                            }
                            yield {
                                type: 'content_block_delta',
                                index: currentIndex,
                                delta: { type: 'text_delta', text: textContent },
                            };
                        }
                        // 处理工具调用
                        if (delta.tool_calls) {
                            for (const toolCall of delta.tool_calls) {
                                if (toolCall.function?.name) {
                                    currentIndex++;
                                    yield {
                                        type: 'content_block_start',
                                        index: currentIndex,
                                        content_block: {
                                            type: 'tool_use',
                                            id: toolCall.id || `tool_${currentIndex}`,
                                            name: toolCall.function.name,
                                            input: {},
                                        },
                                    };
                                }
                                if (toolCall.function?.arguments) {
                                    yield {
                                        type: 'content_block_delta',
                                        index: currentIndex,
                                        delta: { type: 'input_json_delta', partial_json: toolCall.function.arguments },
                                    };
                                }
                            }
                        }
                        // 处理完成
                        if (choice.finish_reason && !isFirstChunk) {
                            yield { type: 'content_block_stop', index: currentIndex };
                            if (event.usage) {
                                yield {
                                    type: 'message_delta',
                                    usage: { output_tokens: event.usage.completion_tokens },
                                };
                            }
                        }
                    }
                }
                catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }
    formatMessages(messages) {
        return messages.map((msg) => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            content: msg.content,
        }));
    }
    toConfig() {
        return {
            provider: 'anthropic',
            model: this.model,
            baseUrl: this.baseUrl,
            apiKey: this.apiKey,
            maxTokens: this.maxOutputTokens,
            temperature: this.temperature,
        };
    }
}
exports.AnthropicProvider = AnthropicProvider;
