import React from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface FollowUpPanelProps {
    followUps?: CustomerProfile['follow_ups'];
}

const FollowUpPanel: React.FC<FollowUpPanelProps> = ({ followUps }) => {
    return (
        <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border border-gray-100 p-5 space-y-4 shrink-0 mb-6">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <i className="fa-solid fa-file-signature text-blue-500"></i> 最新跟进记录
                </span>
                <span className="text-[10px] text-gray-400">{(followUps && followUps.length > 0) ? followUps[0].time : '暂无'}</span>
            </div>

            <div className="space-y-4">
                {(followUps && followUps.length > 0) ? followUps.slice(0, 3).map((record, idx) => (
                    <div key={idx} className={record.type === 'AI' ? "flex gap-3" : "rounded-2xl border border-dashed border-gray-200 p-4 bg-[#F9FAFB]"}>
                        {record.type === 'AI' ? (
                            <>
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-sm font-bold shrink-0">
                                    AI
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-gray-700">AI助手 (Copilot)</span>
                                        <span className="text-[10px] text-gray-400">自动总结</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {record.content}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                                            <i className={`fa-solid ${record.type === '电话' ? 'fa-phone' : 'fa-comment'}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{record.type}联系</p>
                                            <p className="text-[10px] text-gray-400">{record.time}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-orange-500 font-bold">查看详情 {'>'}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {record.content}
                                </p>
                            </>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                        <p className="text-xs text-gray-400 mb-2">暂无跟进记录</p>
                        <button className="text-[10px] text-orange-500 font-bold bg-white border border-orange-200 px-3 py-1 rounded-full hover:bg-orange-50 transition-colors">
                            <i className="fa-solid fa-plus mr-1"></i> 添加记录
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowUpPanel;
