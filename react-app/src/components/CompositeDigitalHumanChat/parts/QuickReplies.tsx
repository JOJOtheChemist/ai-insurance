
import React from 'react';

export interface QuickReplyProps {
    replies: string[];
    onReply: (reply: string) => void;
}

export const QuickReplies: React.FC<QuickReplyProps> = ({ replies, onReply }) => (
    <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
        {replies.map((reply, idx) => (
            <button
                key={idx}
                onClick={() => onReply(reply)}
                className="px-4 py-2 bg-[#F0F7FF] text-blue-700 text-xs font-semibold rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:bg-[#E0EFFF] active:scale-95 transition-all duration-200"
            >
                {reply}
            </button>
        ))}
    </div>
);
