import React, { useState } from 'react';

export interface ToolCall {
    id: string;
    name: string;
    status: 'running' | 'success' | 'failed';
    args?: any;
    result?: any;
    timestamp?: number;
}

interface GenericToolDisplayProps {
    tool: ToolCall;
}

export const GenericToolDisplay: React.FC<GenericToolDisplayProps> = ({ tool }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-2 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden w-full max-w-full">
            <div
                className="flex items-center gap-2 p-2 px-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    {tool.status === 'running' && (
                        <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-xs"></i>
                    )}
                    {tool.status === 'success' && (
                        <i className="fa-solid fa-check text-green-500 text-xs"></i>
                    )}
                    {tool.status === 'failed' && (
                        <i className="fa-solid fa-xmark text-red-500 text-xs"></i>
                    )}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700 truncate">
                        Using {tool.name}
                    </span>
                    {tool.status === 'running' && (
                        <span className="text-[10px] text-gray-400 animate-pulse">Running...</span>
                    )}
                </div>

                <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </div>

            {/* Expanded Details */}
            <div className={`transition-all duration-200 ease-in-out ${isOpen ? 'max-h-[500px] border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-2 bg-white text-[11px] font-mono text-gray-600 overflow-x-auto">
                    {tool.args && (
                        <div className="mb-1">
                            <span className="text-gray-400 select-none">ARGS: </span>
                            <span className="text-blue-600">{JSON.stringify(tool.args)}</span>
                        </div>
                    )}
                    {tool.result && (
                        <div>
                            <span className="text-gray-400 select-none">RES: </span>
                            <span className="text-green-600">{typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
