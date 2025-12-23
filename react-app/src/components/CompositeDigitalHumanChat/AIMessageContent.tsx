
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CustomerProfileCards } from '../CustomerInfoCards';

// Re-export ToolCall type for backward compatibility
export type { ToolCall } from './ToolStatus';

interface QuickReplyProps {
    replies: string[];
    onReply: (reply: string) => void;
}

const QuickReplies: React.FC<QuickReplyProps> = ({ replies, onReply }) => (
    <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
        {replies.map((reply, idx) => (
            <button
                key={idx}
                onClick={() => onReply(reply)}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:from-blue-100 hover:to-indigo-100 active:scale-95 transition-all duration-200"
            >
                {reply}
            </button>
        ))}
    </div>
);

interface SuggestedStepsProps {
    steps: string[];
    onStep: (step: string) => void;
}

const SuggestedSteps: React.FC<SuggestedStepsProps> = ({ steps, onStep }) => (
    <div className="mt-4 pt-3 border-t border-gray-100 animate-fadeIn">
        <p className="text-xs font-bold text-gray-400 mb-3 pl-1 tracking-wide uppercase">Suggested Actions</p>
        <div className="flex flex-col gap-2">
            {steps.map((step, idx) => (
                <button
                    key={idx}
                    onClick={() => onStep(step)}
                    className="group relative overflow-hidden text-left w-full px-4 py-3 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex items-center justify-between"
                >
                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="relative z-10 flex-1">{step}</span>
                    <i className="relative z-10 fa-solid fa-arrow-right text-gray-300 group-hover:text-blue-500 transition-colors duration-200 -translate-x-2 group-hover:translate-x-0 transform" />
                </button>
            ))}
        </div>
    </div>
);

interface AIMessageContentProps {
    content: string;
    onSend: (msg: string) => void;
    onUpdateProfile?: (profile: any) => void;
}

/**
 * AI 消息内容组件
 * 负责解析 JSON 响应并渲染：
 * 1. 文本内容 (ReactMarkdown)
 * 2. 思考过程 (Think content)
 * 3. 客户档案更新卡片 (CustomerProfileCards)
 * 4. 快捷回复 (QuickReplies)
 * 5. 建议下一步 (SuggestedSteps)
 * 
 * 注意: 工具调用由 MessageBubble 组件处理，不在这里渲染
 */
export const AIMessageContent: React.FC<AIMessageContentProps> = ({ content, onSend, onUpdateProfile }) => {
    const [parsedData, setParsedData] = useState<{
        textContent: string;
        quickReplies: string[];
        suggestedSteps: string[];
        profileUpdates: any;
        thinkContent: string | null;
        recommendations: any[];
    }>({
        textContent: '',
        quickReplies: [],
        suggestedSteps: [],
        profileUpdates: null,
        thinkContent: null,
        recommendations: []
    });

    useEffect(() => {
        let textContent = content;
        let quickReplies: string[] = [];
        let suggestedSteps: string[] = [];
        let profileUpdates: any = null;
        let thinkContent: string | null = null;
        let recommendations: any[] = [];

        try {
            // 1. 尝试解析完整 JSON
            const json = JSON.parse(content);

            if (json.content || json.insight_summary) {
                textContent = json.insight_summary || json.content;
            }

            if (json.quick_replies && Array.isArray(json.quick_replies)) quickReplies = json.quick_replies;

            // Handle both suggested_next_steps and next_actions
            if (json.suggested_next_steps && Array.isArray(json.suggested_next_steps)) {
                suggestedSteps = json.suggested_next_steps;
            } else if (json.next_actions && Array.isArray(json.next_actions)) {
                suggestedSteps = json.next_actions;
            }

            if (json.customer_profile) profileUpdates = json.customer_profile;
            if (json.thought || json.thinking) thinkContent = json.thought || json.thinking;

            if (json.recommendations && Array.isArray(json.recommendations)) {
                recommendations = json.recommendations;
            }

        } catch (e) {
            // 2. 解析失败（可能是流式传输中，或者包含 Markdown 代码块）
            // 尝试通过正则寻找所有的 JSON 块
            const jsonBlockMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);

            if (jsonBlockMatch) {
                const rawJson = jsonBlockMatch[1];
                try {
                    // 尝试解析提取出的 JSON
                    const json = JSON.parse(rawJson);
                    if (json.content || json.insight_summary) textContent = json.insight_summary || json.content;
                    if (json.quick_replies) quickReplies = json.quick_replies;
                    if (json.suggested_next_steps || json.next_actions) suggestedSteps = json.suggested_next_steps || json.next_actions;
                    if (json.customer_profile) profileUpdates = json.customer_profile;
                    if (json.thought || json.thinking) thinkContent = json.thought || json.thinking;
                    if (json.recommendations) recommendations = json.recommendations;
                } catch (parseErr) {
                    // 正则回退提取特定字段 (用于流式输出)
                    const insightMatch = rawJson.match(/"insight_summary"\s*:\s*"((?:[^"\\]|\\.)*)/);
                    const contentMatch = rawJson.match(/"content"\s*:\s*"((?:[^"\\]|\\.)*)/);
                    if (insightMatch || contentMatch) {
                        const val = (insightMatch ? insightMatch[1] : contentMatch![1]);
                        try {
                            textContent = JSON.parse(`"${val}"`);
                        } catch (err) {
                            textContent = val.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                        }
                    }
                }
            } else {
                // 3. 完全没有 JSON 迹象，显示原文本
                textContent = content;
            }
        }

        // 仅在数据真正变化时更新
        setParsedData({
            textContent,
            quickReplies,
            suggestedSteps,
            profileUpdates,
            thinkContent,
            recommendations: recommendations || []
        });

        // 触发外部档案更新 (副作用)
        if (profileUpdates && onUpdateProfile) {
            onUpdateProfile(profileUpdates);
        }

    }, [content, onUpdateProfile]);

    return (
        <div className="space-y-3 w-full">
            {/* 1. 客户档案卡片 */}
            {parsedData.profileUpdates && (
                <div className="mb-2 w-full">
                    <CustomerProfileCards data={parsedData.profileUpdates} />
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mt-2 shadow-sm">
                        <div className="flex items-start gap-2">
                            <i className="fa-solid fa-circle-check text-green-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-green-700 mb-1">✅ 已更新客户信息</p>
                                <details className="text-xs group">
                                    <summary className="text-green-600 cursor-pointer font-medium select-none">详情</summary>
                                    <pre className="mt-2 p-2 bg-white rounded border border-green-100 text-[11px] overflow-x-auto shadow-inner text-gray-600">
                                        {JSON.stringify(parsedData.profileUpdates, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. 思考过程 */}
            {parsedData.thinkContent && (
                <details className="mb-2 group">
                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none transition-colors">
                        <i className="fa-regular fa-lightbulb mr-1"></i>
                        查看思考过程
                    </summary>
                    <div className="mt-2 pl-3 border-l-2 border-gray-100 py-1">
                        <p className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">
                            {parsedData.thinkContent}
                        </p>
                    </div>
                </details>
            )}

            {/* 3. 主要文本内容 */}
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 text-gray-900 message-content leading-7">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {parsedData.textContent}
                </ReactMarkdown>
            </div>

            {/* 3.5 推荐产品卡片 (如果是 V3 Agent 的推荐结构) */}
            {parsedData.recommendations && parsedData.recommendations.length > 0 && (
                <div className="mt-4 space-y-3 animate-fadeIn">
                    <p className="text-xs font-bold text-orange-500 mb-2 pl-1 tracking-wider uppercase flex items-center gap-2">
                        <i className="fa-solid fa-star"></i> 为您甄选的保险产品
                    </p>
                    <div className="space-y-3">
                        {parsedData.recommendations.map((prod, idx) => (
                            <div key={idx} className="bg-white border-2 border-orange-100 rounded-[20px] p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-200 uppercase">
                                        {prod.product_type}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1">{prod.product_name}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed mb-3">{prod.customer_fit}</p>

                                {prod.coverage_highlights && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {prod.coverage_highlights.map((h: string, i: number) => (
                                            <span key={i} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[10px] font-medium border border-blue-100 italic">
                                                #{h}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. 快捷回复按钮 */}
            {parsedData.quickReplies.length > 0 && (
                <QuickReplies replies={parsedData.quickReplies} onReply={onSend} />
            )}

            {/* 5. 建议下一步 */}
            {parsedData.suggestedSteps.length > 0 && (
                <SuggestedSteps steps={parsedData.suggestedSteps} onStep={onSend} />
            )}
        </div>
    );
};
