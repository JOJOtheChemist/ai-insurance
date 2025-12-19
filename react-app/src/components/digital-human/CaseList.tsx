import React from 'react';

const CaseList: React.FC = () => {
    return (
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group text-orange-500"></i> 精选对话案例库
                </h2>
                <div className="flex gap-2">
                    <button className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-500 active:bg-gray-50">高净值</button>
                    <button className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-500 active:bg-gray-50">理赔实录</button>
                </div>
            </div>

            {/* Case Card 1 */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white p-4 group cursor-pointer active:scale-99 transition-all">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">置顶 · 家族信托</span>
                    <span className="text-[10px] text-gray-300">3200人看过</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                    客户咨询：家里有5000万资产，担心子女婚变分割，如何设计信托架构？
                </h3>

                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed border border-gray-100 mb-3">
                    <span className="font-bold text-gray-800">张伟 AI：</span>
                    这需要做“三层隔离”设计。首先，资金必须在婚前完成信托置入；其次，受益人条款中需明确...
                </div>

                <div className="flex items-center justify-between text-[10px]">
                    <div className="flex gap-2 text-gray-400">
                        <span><i className="fa-regular fa-clock mr-1"></i>38轮深度对话</span>
                    </div>
                    <span className="text-orange-500 font-bold flex items-center">
                        查看完整对话 <i className="fa-solid fa-chevron-right ml-1 text-[8px]"></i>
                    </span>
                </div>
            </div>

            {/* Case Card 2 */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white p-4 group cursor-pointer active:scale-99 transition-all">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">企业资产隔离</span>
                    <span className="text-[10px] text-gray-300">1800人看过</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    企业主咨询：公司可能面临债务纠纷，我的个人寿险会被强制执行吗？
                </h3>

                <div className="flex items-center justify-between text-[10px] mt-3">
                    <div className="flex gap-2 text-gray-400">
                        <span><i className="fa-regular fa-clock mr-1"></i>12轮对话</span>
                        <span><i className="fa-solid fa-file-contract mr-1"></i>附法条引用</span>
                    </div>
                    <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                        查看详情
                    </button>
                </div>
            </div>

            {/* Case Card 3 */}
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white p-4 group cursor-pointer active:scale-99 transition-all opacity-90">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">重疾险理赔</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
                    甲状腺结节被除外承保了，以后转成甲状腺癌还能赔吗？
                </h3>

                <div className="flex items-center justify-between text-[10px] mt-3">
                    <div className="flex gap-2 text-gray-400">
                        <span><i className="fa-regular fa-clock mr-1"></i>8轮对话</span>
                    </div>
                    <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                        查看详情
                    </button>
                </div>
            </div>

            <div className="h-12"></div>
        </main>
    );
};

export default CaseList;
