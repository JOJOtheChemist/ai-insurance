
import React from 'react';

interface InputAreaProps {
    onSend?: (msg: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend }) => {
    const handleSend = () => {
        const input = document.getElementById('user-input-field') as HTMLInputElement;
        if (input && input.value.trim()) {
            onSend?.(input.value);
            input.value = '';
        }
    };

    return (
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-4 py-3 pb-6 z-50 flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:text-orange-500 transition-colors flex items-center justify-center">
                <i className="fa-solid fa-microphone text-lg"></i>
            </button>
            <div className="flex-1 bg-gray-100 rounded-full h-11 px-4 flex items-center border border-transparent focus-within:bg-white focus-within:border-gray-300 transition-colors">
                <input
                    id="user-input-field"
                    type="text"
                    placeholder="向数智保险策略官咨询..."
                    className="bg-transparent flex-1 outline-none text-sm text-gray-800 w-full"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
            </div>
            <button
                onClick={handleSend}
                className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <i className="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    );
};
