
import React, { useState } from 'react';

const HistoryRecords: React.FC = () => {
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopy = (id: number) => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F0F2F5] font-['Noto_Sans_SC'] p-5 overflow-auto">

            <div className="w-[400px] bg-white rounded-[40px] shadow-xl border border-orange-100 overflow-hidden flex flex-col h-[780px]">

                <div className="p-6 pb-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">王志远</h2>
                    <div className="h-20 bg-orange-50 rounded-2xl mb-4 border border-orange-100 flex items-center justify-center text-gray-400 text-xs">
                        (此处为画像/需求区域)
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 border-t border-gray-100 pt-5 pb-6 flex flex-col">

                    <div className="px-6 flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-xs">
                                <i className="fa-solid fa-clock-rotate-left"></i>
                            </span>
                            <span className="text-sm font-bold text-gray-700">话术锦囊记录</span>
                            <span className="bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full">12条</span>
                        </div>
                        <button className="text-xs text-orange-500 hover:text-orange-600 font-bold">查看全部</button>
                    </div>

                    <div className="flex overflow-x-auto gap-3 px-6 pb-2 snap-x snap-mandatory scrollbar-hide h-full items-start">

                        <div className="min-w-[80%] snap-center bg-white border border-orange-200 rounded-[24px] p-4 shadow-sm flex flex-col h-48 relative group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-orange-100 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    🔥 降维打击策略
                                </span>
                                <span className="text-[10px] text-gray-400">刚刚</span>
                            </div>

                            <div className="relative flex-1">
                                <i className="fa-solid fa-quote-left text-orange-100 text-2xl absolute -top-1 -left-1"></i>
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 pl-4 pt-1 font-medium">
                                    王总，咱们先把保额锁定，用定期消费型把杠杆拉满，每年只要6000多。等过几年经济环境好了...
                                </p>
                            </div>

                            <button
                                onClick={() => handleCopy(1)}
                                className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white shadow-sm ${copiedId === 1 ? 'border-green-400 text-green-500 scale-105' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
                            >
                                {copiedId === 1 ? (
                                    <>
                                        <i className="fa-solid fa-check"></i> 已复制
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-regular fa-copy"></i> 一键复制
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="min-w-[80%] snap-center bg-white border border-gray-200 rounded-[24px] p-4 shadow-sm flex flex-col h-48 group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    🛡️ 嫌保费贵
                                </span>
                                <span className="text-[10px] text-gray-400">昨天 14:30</span>
                            </div>

                            <div className="relative flex-1">
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 pt-1">
                                    这笔钱其实不是消费，而是把未来的风险成本现在就锁定下来。如果我们分摊到每天，其实也就是一杯咖啡钱...
                                </p>
                            </div>

                            <button
                                onClick={() => handleCopy(2)}
                                className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white ${copiedId === 2 ? 'border-green-400 text-green-500 scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
                            >
                                {copiedId === 2 ? (
                                    <>
                                        <i className="fa-solid fa-check"></i> 已复制
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-regular fa-copy"></i> 复制
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="min-w-[80%] snap-center bg-white border border-gray-200 rounded-[24px] p-4 shadow-sm flex flex-col h-48 opacity-90">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    📘 绿通服务介绍
                                </span>
                                <span className="text-[10px] text-gray-400">3天前</span>
                            </div>

                            <div className="relative flex-1">
                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 pt-1">
                                    这款产品最大的亮点就是协和、华西的直通车服务。一旦确诊，哪怕挂不上号，我们也有专人陪诊...
                                </p>
                            </div>

                            <button
                                onClick={() => handleCopy(3)}
                                className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white ${copiedId === 3 ? 'border-green-400 text-green-500 scale-105' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}`}
                            >
                                {copiedId === 3 ? (
                                    <>
                                        <i className="fa-solid fa-check"></i> 已复制
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-regular fa-copy"></i> 复制
                                    </>
                                )}
                            </button>
                        </div>

                    </div>

                    <div className="flex justify-center gap-1 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default HistoryRecords;
