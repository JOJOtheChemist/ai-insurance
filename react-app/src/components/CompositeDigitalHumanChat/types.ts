import type { ReactNode } from 'react';
import type { ToolCall } from './AIMessageContent';

export interface Message {
    role: 'user' | 'ai';
    content: string | ReactNode;
    toolCalls?: ToolCall[];
    hideBubble?: boolean;
}

export interface CompositeDigitalHumanChatProps {
    initialMessage?: string;
    onMessageConsumed?: () => void;
}

export type Stage = 0 | 1 | 2;
