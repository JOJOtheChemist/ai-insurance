import React from 'react';

interface Message {
    role: 'user' | 'ai';
    content: string | React.ReactNode;
}

interface MessageBubbleProps {
    message: Message;
    index: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index }) => {
    let extractedProfile = null;
    if (message.role === 'ai' && typeof message.content === 'string') {
        try {
            const parsed = JSON.parse(message.content);
            if (parsed.customer_profile && parsed.customer_profile.name) {
                extractedProfile = parsed.customer_profile;
            }
        } catch (e) { }
    }

    return (
        <div key={index}>
            <div className={`flex w-full ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 animate-[fadeInUp_0.3s_ease-out]`}>
                <div className={`w-8 h-8 rounded-full border border-white shrink-0 overflow-hidden flex items-center justify-center ${message.role === 'ai' ? 'bg-blue-50 text-blue-600 text-xs font-bold' : 'bg-orange-100'}`}>
                    {message.role === 'ai' ? 'AI' : <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" alt="User" />}
                </div>
                <div className={`px-4 py-2.5 text-sm shadow-sm max-w-[85%] ${message.role === 'user' ? 'bg-[#1F2937] text-white rounded-[20px_4px_20px_20px]' : 'bg-[#F3F4F6] text-[#1F2937] rounded-[4px_20px_20px_20px]'}`}>
                    {message.content}
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
