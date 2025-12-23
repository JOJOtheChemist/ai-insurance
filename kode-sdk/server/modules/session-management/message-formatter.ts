/**
 * Message Formatter - Convert stored messages to frontend format
 */

export interface ToolCall {
    id: string;
    name: string;
    status: 'running' | 'success' | 'error';
    args?: any;
    result?: any;
    timestamp: number;
}

export interface FrontendMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolCalls?: ToolCall[];
    timestamp?: string;
}

/**
 * Convert raw stored messages (Anthropic format) to frontend format
 * Handles merging tool_use and tool_result blocks into toolCalls
 */
export function formatMessagesForFrontend(messages: any[]): FrontendMessage[] {
    const result: FrontendMessage[] = [];
    const toolCallsMap = new Map<string, ToolCall>();

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        if (msg.role === 'user') {
            // User message: extract text content
            const textParts = extractTextFromContent(msg.content);
            result.push({
                id: `msg-${i}`,
                role: 'user',
                content: textParts,
                timestamp: msg.timestamp
            });
        } else if (msg.role === 'assistant') {
            // Assistant message: extract text and tool_use
            const textParts = extractTextFromContent(msg.content);
            const toolUses = extractToolUses(msg.content);

            // Create tool calls from tool_use blocks
            const currentToolCalls: ToolCall[] = [];
            for (const toolUse of toolUses) {
                const toolCall: ToolCall = {
                    id: toolUse.id,
                    name: toolUse.name,
                    status: 'running', // Initially mark as running
                    args: toolUse.input,
                    timestamp: Date.now()
                };
                toolCallsMap.set(toolUse.id, toolCall);
                currentToolCalls.push(toolCall);
            }

            // Look ahead for tool_result in next user message
            if (i + 1 < messages.length && messages[i + 1].role === 'user') {
                const nextMsg = messages[i + 1];
                const toolResults = extractToolResults(nextMsg.content);

                for (const toolResult of toolResults) {
                    const toolCall = toolCallsMap.get(toolResult.tool_use_id);
                    if (toolCall) {
                        toolCall.status = toolResult.is_error ? 'error' : 'success';
                        toolCall.result = toolResult.content;
                    }
                }
            }

            result.push({
                id: `msg-${i}`,
                role: 'assistant',
                content: textParts,
                toolCalls: currentToolCalls.length > 0 ? currentToolCalls : undefined,
                timestamp: msg.timestamp
            });
        }
    }

    return result;
}

/**
 * Extract text content from message content (handles both string and block array)
 */
function extractTextFromContent(content: any): string {
    if (typeof content === 'string') {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .filter((block: any) => block.type === 'text')
            .map((block: any) => block.text)
            .join('\n');
    }

    return '';
}

/**
 * Extract tool_use blocks from assistant message content
 */
function extractToolUses(content: any): Array<{ id: string; name: string; input: any }> {
    if (!Array.isArray(content)) {
        return [];
    }

    return content
        .filter((block: any) => block.type === 'tool_use')
        .map((block: any) => ({
            id: block.id,
            name: block.name,
            input: block.input
        }));
}

/**
 * Extract tool_result blocks from user message content
 */
function extractToolResults(content: any): Array<{ tool_use_id: string; content: any; is_error: boolean }> {
    if (!Array.isArray(content)) {
        return [];
    }

    return content
        .filter((block: any) => block.type === 'tool_result')
        .map((block: any) => ({
            tool_use_id: block.tool_use_id,
            content: block.content,
            is_error: block.is_error || false
        }));
}
