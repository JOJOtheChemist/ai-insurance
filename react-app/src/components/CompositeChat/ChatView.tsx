import React from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
}

interface ChatViewProps {
    stage: 0 | 1 | 2;
    messages: Message[];
    chatContainerRef: React.RefObject<HTMLDivElement | null>;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatView: React.FC<ChatViewProps> = ({
    stage,
    messages,
    chatContainerRef,
    messagesEndRef
}) => {
    return (
        <div
            ref={chatContainerRef}
            className={`px-4 flex-1 overflow-y-auto pt-2 space-y-4 pb-24 ${stage > 0 ? 'block animate-[fadeIn_0.5s_forwards]' : 'hidden'}`}
        >
            {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} index={idx} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
