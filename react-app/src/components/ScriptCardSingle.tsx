
import React, { useState } from 'react';

const ScriptCardSingle: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F2F4F6] font-['Noto_Sans_SC'] p-4 overflow-y-auto">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_20px_40px_-12px_rgba(255,107,53,0.15)] border border-orange-100 overflow-hidden relative group">

                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -z-0 pointer-events-none"></div>

                <div className="p-5 pb-2 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-md">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </span>
                        <span className="text-sm font-bold text-gray-800">策略分析引擎</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">
                                <i className="fa-solid fa-id-card-clip mr-1"></i>客户画像
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-medium shadow-sm">
                                    企业高管
                                </span>
                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-medium shadow-sm">
                                    现金流敏感
                                </span>
                                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-medium shadow-sm">
                                    理性决策
                                </span>
                            </div>
                        </div>

                        <div className="bg-red-50/50 border border-red-100 rounded-[24px] p-3">
                            <p className="text-[10px] font-bold text-red-400 uppercase mb-2 tracking-wider">
                                <i className="fa-solid fa-shield-virus mr-1"></i>抗拒点
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                <span className="px-2 py-1 bg-white border border-red-100 text-red-500 rounded-full text-[10px] font-medium shadow-sm flex items-center gap-1">
                                    <i className="fa-solid fa-xmark text-[8px]"></i> 嫌保费贵
                                </span>
                                <span className="px-2 py-1 bg-white border border-red-100 text-red-500 rounded-full text-[10px] font-medium shadow-sm flex items-center gap-1">
                                    <i className="fa-solid fa-xmark text-[8px]"></i> 怕被套牢
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-2 relative z-10">
                    <div className="bg-gradient-to-b from-[#FFF5F0] to-white border border-orange-200 rounded-[24px] p-4 relative">
                        <i className="fa-solid fa-quote-left absolute top-4 left-4 text-orange-200 text-3xl -z-10"></i>

                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full">
                                推荐语气：同理心 + 专业建议
                            </span>
                            <div className="flex gap-1">
                                <button className="text-gray-300 hover:text-orange-500 transition-colors" title="重新生成">
                                    <i className="fa-solid fa-arrows-rotate text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            “王总，非常理解您的想法。现在的环境，谁手里的<span className="bg-orange-100 text-orange-700 px-1 rounded mx-0.5">现金流</span>都很宝贵。
                            <br /><br />
                            但风险是不等人的。我给您出一个<span className="border-b-2 border-orange-300 font-bold text-gray-800">‘降维打击’</span>的方案：我们先把这100万的保额锁定，用定期险把保费降到<span className="text-orange-600 font-bold">6000元/年</span>。
                            <br /><br />
                            这样既不占用您现在的资金，保障也没有降级。等过几年经济形势好了，我们再转成终身，您看这样是不是更稳妥？”
                        </p>
                    </div>
                </div>

                <div className="p-5 pt-2 flex gap-3 relative z-10">
                    <button
                        onClick={handleCopy}
                        className="flex-1 bg-gradient-to-br from-[#FF9A5C] to-[#FF6B35] text-white py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 group"
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

                    <button className="w-12 h-12 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ScriptCardSingle;
