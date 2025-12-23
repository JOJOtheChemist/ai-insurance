
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CustomerProfileCards } from '../CustomerInfoCards';

// Import refactored parts and utils
import { tryParsePartialJson, knownKeys } from './utils/messageParser';
import { QuickReplies } from './parts/QuickReplies';
import { SuggestedSteps } from './parts/SuggestedSteps';
import { RecommendationList } from './parts/RecommendationList';
import { SalesPitchCard } from './parts/SalesPitchCard';

// Re-export ToolCall type for backward compatibility
export type { ToolCall } from './ToolStatus';

interface AIMessageContentProps {
    content: string;
    onSend: (msg: string) => void;
    toolCalls?: any[];
    onUpdateProfile?: (profile: any) => void;
}

export const AIMessageContent: React.FC<AIMessageContentProps> = ({ content, onSend, onUpdateProfile }) => {
    const [parsedData, setParsedData] = useState<{
        textContent: string;
        quickReplies: string[];
        suggestedSteps: string[];
        profileUpdates: any;
        thinkContent: string | null;
        recommendations: any[];
        salesPitch: any | null;
    }>({
        textContent: '',
        quickReplies: [],
        suggestedSteps: [],
        profileUpdates: null,
        thinkContent: null,
        recommendations: [],
        salesPitch: null
    });

    useEffect(() => {
        let textContent = content;
        let quickReplies: string[] = [];
        let suggestedSteps: string[] = [];
        let profileUpdates: any = null;
        let thinkContent: string | null = null;
        let recommendations: any[] = [];
        let salesPitch: any = null;

        try {
            let json: any = null;
            try {
                const trimmed = content.trim();

                if (trimmed.startsWith('{')) {
                    json = JSON.parse(content);
                } else if (trimmed.startsWith('```json')) {
                    // Handled below
                } else {
                    const hasJsonResponse = knownKeys.some(key => content.includes(key));
                    if (hasJsonResponse) {
                        if (!trimmed.startsWith('{') && trimmed.includes(':')) {
                            json = tryParsePartialJson('{' + content);
                        }
                    }
                }
            } catch {
                if (content.trim().startsWith('{')) {
                    json = tryParsePartialJson(content);
                } else {
                    json = tryParsePartialJson('{' + content);
                }
            }

            if (!json) {
                const jsonBlockMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
                if (jsonBlockMatch) {
                    const rawJson = jsonBlockMatch[1];
                    json = tryParsePartialJson(rawJson);
                }
            }

            if (json) {
                if (json.content || json.insight_summary) {
                    textContent = json.insight_summary || json.content;
                }

                if (json.quick_replies && Array.isArray(json.quick_replies)) quickReplies = json.quick_replies;

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

                if (json.sales_pitch) salesPitch = json.sales_pitch;
            } else {
                const insightMatch = content.match(/"insight_summary"\s*:\s*"((?:[^"\\]|\\.)*)/);
                const contentMatch = content.match(/"content"\s*:\s*"((?:[^"\\]|\\.)*)/);
                if (insightMatch || contentMatch) {
                    const val = (insightMatch ? insightMatch[1] : contentMatch![1]);
                    try {
                        textContent = JSON.parse(`"${val}"`);
                    } catch {
                        textContent = val.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                    }
                }

                const salesPitchIdx = content.indexOf('"sales_pitch"');
                if (salesPitchIdx > -1) {
                    const subStr = content.substring(salesPitchIdx);
                    const valueStart = subStr.indexOf(':');
                    if (valueStart > -1) {
                        const potentialJson = subStr.substring(valueStart + 1).trim();
                        if (potentialJson.startsWith('{')) {
                            const repairedPitch = tryParsePartialJson(potentialJson);
                            if (repairedPitch) {
                                salesPitch = repairedPitch;
                            }
                        }
                    }
                }

                const hasJsonResponse = knownKeys.some(key => content.includes(key));

                if (!textContent && hasJsonResponse) {
                    textContent = '';
                } else if (!textContent && !hasJsonResponse && !content.trim().startsWith('{')) {
                    textContent = content;
                }
            }

        } catch (e) {
            console.warn('Parse logic error:', e);
            const hasJsonResponse = knownKeys.some(key => content.includes(key));
            if (!hasJsonResponse && !content.trim().startsWith('{')) {
                textContent = content;
            } else {
                textContent = '';
            }
        }

        setParsedData({
            textContent,
            quickReplies,
            suggestedSteps,
            profileUpdates,
            thinkContent,
            recommendations: recommendations || [],
            salesPitch
        });

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
                    <div className="mb-2 bg-[#F2FAF5] border border-green-200 rounded-xl overflow-hidden w-full max-w-full shadow-sm hover:shadow-md transition-all duration-300 p-3 mt-2">
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
                <RecommendationList recommendations={parsedData.recommendations} />
            )}

            {/* 3.6 推荐推销话术 (Sales Pitch) */}
            {parsedData.salesPitch && (
                <SalesPitchCard data={parsedData.salesPitch} />
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
