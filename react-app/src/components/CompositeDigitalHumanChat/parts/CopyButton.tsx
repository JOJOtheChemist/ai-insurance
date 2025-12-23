
import React, { useState } from 'react';

export const CopyButton: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text); // Copy raw text without quotes
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`text-gray-400 hover:text-blue-600 transition-colors p-1 ${className || ''}`}
            title="复制内容"
        >
            {copied ? (
                <i className="fa-solid fa-check text-green-500 text-xs animate-bounce"></i>
            ) : (
                <i className="fa-regular fa-copy text-xs"></i>
            )}
        </button>
    );
};
