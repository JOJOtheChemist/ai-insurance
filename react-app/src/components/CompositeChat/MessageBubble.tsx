import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { ToolStatus, type ToolCall } from '../CompositeDigitalHumanChat/ToolStatus';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
    toolCalls?: ToolCall[];
}

interface MessageBubbleProps {
    message: Message;
    index: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
    let extractedProfile = null;
    let displayContent = message.content;

    // 🔥 Filter out [System Context] from user messages
    if (message.role === 'user' && typeof message.content === 'string') {
        // Remove everything from start up to and including the System Context block
        // The format is: \n[System Context]\n...multiple lines...\n\nActual message
        displayContent = message.content.replace(/^[\s\S]*?\[System Context\][\s\S]*?\n\n/, '').trim();
    }

    if (message.role === 'ai' && typeof message.content === 'string') {
        try {
            const parsed = JSON.parse(message.content);
            if (parsed.customer_profile && parsed.customer_profile.name) {
                extractedProfile = parsed.customer_profile;
            }
        } catch (e) {
            // Not JSON, normal text
        }
    }

    return (
        <div key={index}>
            <div className={`flex w-full ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 animate-[fadeInUp_0.3s_ease-out]`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full border border-white shrink-0 overflow-hidden flex items-center justify-center ${message.role === 'ai' ? 'bg-blue-50 text-blue-600 text-xs font-bold' : 'bg-orange-100'}`}>
                    {message.role === 'ai' ? 'AI' : <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" alt="User" />}
                </div>

                {/* Content Column (Tools + Bubble) */}
                <div className={`flex flex-col gap-2 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>

                    {/* Tool Status (Outside Bubble) */}
                    {message.role === 'ai' && message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="w-full flex flex-col gap-1">
                            {message.toolCalls.map((tool) => (
                                <ToolStatus key={tool.id} tool={tool} />
                            ))}
                        </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`px-4 py-2.5 text-sm shadow-sm w-full ${message.role === 'user' ? 'bg-[#1F2937] text-white rounded-[20px_4px_20px_20px]' : 'bg-[#F3F4F6] text-[#1F2937] rounded-[4px_20px_20px_20px] overflow-hidden'}`}>
                        {message.role === 'ai' && typeof message.content === 'string' ? (
                            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        ) : message.role === 'user' && typeof displayContent === 'string' ? (
                            <div className="whitespace-pre-wrap">{displayContent}</div>
                        ) : (
                            displayContent
                        )}
                    </div>
                </div>
            </div>
            {extractedProfile && (
                <div className="ml-11 mt-2 bg-green-50 border-2 border-green-500 rounded-lg p-3">
                    <p className="text-xs font-bold text-green-700 mb-2">✅ 已提取客户信息：</p>
                    <pre className="text-[11px] bg-white p-2 rounded border border-green-200 overflow-x-auto">{JSON.stringify(extractedProfile, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
