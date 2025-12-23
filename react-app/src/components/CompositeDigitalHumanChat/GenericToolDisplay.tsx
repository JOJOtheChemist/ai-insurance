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

const TOOL_NAME_MAP: Record<string, string> = {
    'get_client_profile': '查询客户档案',
    'get_current_client_profile': '获取当前客户信息',
    'update_client_intelligence': '同步客户画像',
    'submit_insurance_plan': '提交保险方案',
    'insurance_search': '搜索保险产品',
    'insurance_filter': '筛选保险产品',
    'insurance_inspect': '查看产品详情',
    'fs_glob': '检索系统文件',
    'fs_read': '读取文件内容',
    'fs_grep': '文本模式匹配'
};

export const GenericToolDisplay: React.FC<GenericToolDisplayProps> = ({ tool }) => {
    const [isOpen, setIsOpen] = useState(false);
    const displayName = TOOL_NAME_MAP[tool.name] || tool.name;

    return (
        <div className="mb-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 overflow-hidden w-full max-w-full shadow-sm hover:shadow-md transition-all duration-300">
            <div
                className="flex items-center gap-3 p-2.5 px-3.5 cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-50">
                    {tool.status === 'running' && (
                        <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-[10px]"></i>
                    )}
                    {tool.status === 'success' && (
                        <i className="fa-solid fa-check text-green-500 text-[10px]"></i>
                    )}
                    {tool.status === 'failed' && (
                        <i className="fa-solid fa-triangle-exclamation text-red-500 text-[10px]"></i>
                    )}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-700 truncate">
                        {displayName}
                    </span>
                    {tool.status === 'running' && (
                        <span className="text-[11px] text-blue-400 font-medium animate-pulse">执行中...</span>
                    )}
                    {tool.status === 'success' && (
                        <span className="text-[11px] text-green-500 font-medium">已完成</span>
                    )}
                    {tool.status === 'failed' && (
                        <span className="text-[11px] text-red-400 font-medium">执行失败</span>
                    )}
                </div>

                <i className={`fa-solid fa-chevron-down text-gray-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </div>

            {/* Expanded Details */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-3 bg-gray-50/50 text-[11px] font-mono text-gray-500 overflow-x-auto space-y-2">
                    {tool.args && (
                        <div className="flex gap-2">
                            <span className="text-gray-400 shrink-0 font-bold uppercase tracking-tighter">输入:</span>
                            <span className="text-blue-600/80 break-all">{JSON.stringify(tool.args, null, 2)}</span>
                        </div>
                    )}
                    {tool.result && (
                        <div className="flex gap-2 pt-1 border-t border-gray-200/50">
                            <span className="text-gray-400 shrink-0 font-bold uppercase tracking-tighter">输出:</span>
                            <span className="text-green-600/80 break-all">{typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
