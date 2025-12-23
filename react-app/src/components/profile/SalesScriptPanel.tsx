import React, { useState } from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface SalesScriptPanelProps {
    customerData?: CustomerProfile | null;
}

const SalesScriptPanel: React.FC<SalesScriptPanelProps> = ({ customerData }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const scriptText = `"王总，非常理解您的想法。现在的环境，谁手里的现金流都很宝贵。\n\n但风险是不等人的。我给您出一个'降维打击'的方案：我们先把这100万的保额锁定，用定期险把保费降到6000元/年。\n\n这样既不占用您现在的资金，保障也没有降级。等过几年经济形势好了，我们再转成终身，您看这样是不是更稳妥？"`;

        navigator.clipboard.writeText(scriptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // 从客户数据中获取相关信息
    const needs = (customerData?.needs && customerData.needs[0] !== '待确认') ? customerData.needs : [];
    const resistances = customerData?.resistances || ['嫌保费贵', '怕被套牢'];

    return (
        <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border border-gray-100 p-5 space-y-4 shrink-0 mb-6">
            {/* 标题 */}
            <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-md">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                </span>
                <span className="text-sm font-bold text-gray-800">AI推销话术</span>
            </div>

            {/* 需求点和抗拒点 */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50/50 rounded-[18px] p-3 border border-orange-100 flex flex-col h-full">
                    <span className="text-[10px] font-bold text-orange-400 mb-2 tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-bullseye"></i> 需求点
                    </span>
                    <div className="flex flex-wrap gap-1.5 align-content-start">
                        {needs.length > 0 ? (
                            needs.map((need, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white border border-orange-100 text-gray-600 rounded-lg text-[10px] shadow-sm leading-tight">
                                    {need}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-gray-400 italic">暂无需求记录</span>
                        )}
                    </div>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-[18px] p-3">
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-2 tracking-wider">
                        <i className="fa-solid fa-shield-virus mr-1"></i>抗拒点
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {resistances.slice(0, 2).map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white border border-red-100 text-red-500 rounded-full text-[10px] font-medium shadow-sm flex items-center gap-1">
                                <i className="fa-solid fa-xmark text-[8px]"></i> {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 话术内容 */}
            <div className="bg-gradient-to-b from-[#FFF5F0] to-white border border-orange-200 rounded-[18px] p-4 relative">
                <i className="fa-solid fa-quote-left absolute top-3 left-3 text-orange-200 text-2xl -z-10"></i>

                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full">
                        推荐语气：同理心 + 专业建议
                    </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    "王总，非常理解您的想法。现在的环境，谁手里的<span className="bg-orange-100 text-orange-700 px-1 rounded mx-0.5">现金流</span>都很宝贵。
                    <br /><br />
                    但风险是不等人的。我给您出一个<span className="border-b-2 border-orange-300 font-bold text-gray-800">'降维打击'</span>的方案：我们先把这100万的保额锁定，用定期险把保费降到<span className="text-orange-600 font-bold">6000元/年</span>。
                    <br /><br />
                    这样既不占用您现在的资金，保障也没有降级。等过几年经济形势好了，我们再转成终身，您看这样是不是更稳妥？"
                </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex-1 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] text-white py-2.5 rounded-full text-xs font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 group"
                >
                    {copied ? (
                        <>
                            <i className="fa-solid fa-check"></i> 已复制
                        </>
                    ) : (
                        <>
                            <i className="fa-regular fa-copy group-hover:animate-bounce"></i> 一键复制话术
                        </>
                    )}
                </button>

                <button className="w-10 h-10 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all flex items-center justify-center shadow-sm">
                    <i className="fa-solid fa-arrows-rotate text-xs"></i>
                </button>
            </div>
        </div>
    );
};

export default SalesScriptPanel;
