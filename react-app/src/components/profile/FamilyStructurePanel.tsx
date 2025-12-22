import React, { useState } from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface FamilyStructurePanelProps {
    customerData?: CustomerProfile | null;
}

const FamilyStructurePanel: React.FC<FamilyStructurePanelProps> = ({ customerData }) => {
    const [isDetailedFamilyPopupOpen, setIsDetailedFamilyPopupOpen] = useState(false);

    const [expandedMemberIdx, setExpandedMemberIdx] = useState<number | null>(null);

    const displayName = customerData?.name || '待确认';
    const displayAge = customerData?.age ? String(customerData.age) : '-';

    return (
        <>
            <div
                onClick={() => { setIsDetailedFamilyPopupOpen(true); setExpandedMemberIdx(null); }}
                className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative border border-gray-100 overflow-hidden shrink-0 mb-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
                <div className="absolute right-0 top-0 w-24 h-24 bg-gray-50 rounded-bl-full -z-0"></div>

                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur z-10 relative">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs">
                            <i className="fa-solid fa-people-roof"></i>
                        </span>
                        <span className="text-xs font-bold text-gray-700">家庭结构图谱</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); /* TODO: 配置功能 */ }}
                        className="text-[10px] bg-gray-100 hover:bg-orange-50 text-gray-500 hover:text-orange-500 px-2 py-1 rounded-full transition-colors"
                    >
                        配置 <i className="fa-solid fa-chevron-right text-[8px] ml-0.5"></i>
                    </button>
                </div>

                <div className="p-4 flex items-center justify-start z-10 relative overflow-x-auto scrollbar-hide gap-4">
                    {/* Always show "Self" */}
                    <div className="flex flex-col items-center gap-1 opacity-100 shrink-0">
                        <div className="relative">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'self'}`} className="w-10 h-10 rounded-full border-2 border-green-400 p-0.5 bg-white" alt="Avatar" />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] px-1 rounded-full border border-white">
                                本人
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600">{displayName === '待确认' ? '本人' : displayName}</span>
                    </div>

                    {/* Dynamic Family Members */}
                    {customerData?.family_structure && customerData.family_structure.length > 0 ? (
                        customerData.family_structure.map((member, idx) => (
                            <React.Fragment key={idx}>
                                <div className="h-px w-6 bg-gray-200 shrink-0"></div>
                                <div
                                    className="flex flex-col items-center gap-1 shrink-0"
                                    onClick={(e) => { e.stopPropagation(); setIsDetailedFamilyPopupOpen(true); setExpandedMemberIdx(idx); }}
                                >
                                    <div className="relative">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name || member.relation}`}
                                            className={`w-10 h-10 rounded-full border-2 p-0.5 bg-white ${member.status === '已投保' ? 'border-green-400' : 'border-orange-300 grayscale opacity-90'}`}
                                            alt={member.relation}
                                        />
                                        <div className={`absolute -bottom-1 -right-1 text-white text-[8px] px-1 rounded-full border border-white ${member.status && member.status !== '缺口' && member.status !== '待配置' ? 'bg-green-500' : 'bg-orange-400'}`}>
                                            {member.relation}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 truncate max-w-[50px]">{member.name || member.relation}</span>
                                </div>
                            </React.Fragment>
                        ))
                    ) : (
                        <>
                            <div className="h-px w-6 bg-gray-200 shrink-0"></div>
                            <div className="flex flex-col items-center gap-1 shrink-0 opacity-50">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-300">
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">添加</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Detailed Family Popup from OptimizedCustomerCard */}
            {isDetailedFamilyPopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDetailedFamilyPopupOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-md bg-white rounded-t-[30px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[85vh]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">家庭结构详细配置</h3>
                            <button
                                onClick={() => setIsDetailedFamilyPopupOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 bg-[#F2F4F6] min-h-[300px]">
                            {/* Content from OptimizedCustomerCard.tsx */}
                            <div className="bg-white rounded-[24px] border border-gray-200 p-0 overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">成员列表</span>
                                    <button className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-orange-500 hover:border-orange-200 text-xs">
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <div className="p-2 space-y-2">

                                    {/* Self Row */}
                                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200 group">
                                        <div className="flex items-center gap-3">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} className="w-8 h-8 rounded-full bg-gray-100" alt="Avatar" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-700">本人 ({displayName})</p>
                                                <p className="text-[10px] text-gray-400">{displayAge}岁 · 正在配置</p>
                                            </div>
                                        </div>
                                        <i className="fa-solid fa-gear text-gray-300 group-hover:text-gray-500 text-xs mr-2"></i>
                                    </div>

                                    {/* Dynamic Family Rows */}
                                    {customerData?.family_structure?.map((member, idx) => (
                                        <div key={idx} className="flex flex-col overflow-hidden">
                                            <div
                                                onClick={() => setExpandedMemberIdx(expandedMemberIdx === idx ? null : idx)}
                                                className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer border ${expandedMemberIdx === idx ? 'bg-orange-50 border-orange-100' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'} group`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name || member.relation}`} className="w-8 h-8 rounded-full bg-orange-100 shadow-sm" alt="Avatar" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">{member.name || member.relation} ({member.relation})</p>
                                                        {!expandedMemberIdx && (
                                                            <p className={`text-[10px] ${member.status && member.status !== '缺口' && member.status !== '待配置' ? 'text-green-500' : 'text-orange-500'}`}>
                                                                {member.age ? `${member.age}岁 · ` : ''}{member.status && member.status !== '缺口' ? member.status : '需规划'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <i className={`fa-solid fa-chevron-${expandedMemberIdx === idx ? 'up' : 'down'} text-[10px] text-gray-300 group-hover:text-gray-500 mr-2 transition-transform`}></i>
                                            </div>

                                            {expandedMemberIdx === idx && (
                                                <div className="bg-orange-50/30 border-x border-b border-orange-100 p-3 rounded-b-xl -mt-2 pt-5 animate-in slide-in-from-top-1 duration-200">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="bg-white/60 p-2 rounded-lg border border-orange-50">
                                                            <span className="text-[9px] text-gray-400 block mb-0.5">身份/关系</span>
                                                            <span className="text-xs font-bold text-gray-700">{member.relation}</span>
                                                        </div>
                                                        <div className="bg-white/60 p-2 rounded-lg border border-orange-50">
                                                            <span className="text-[9px] text-gray-400 block mb-0.5">姓名</span>
                                                            <span className="text-xs font-bold text-gray-700">{member.name || '待录入'}</span>
                                                        </div>
                                                        <div className="bg-white/60 p-2 rounded-lg border border-orange-50">
                                                            <span className="text-[9px] text-gray-400 block mb-0.5">年龄</span>
                                                            <span className="text-xs font-bold text-gray-700">{member.age || '-'} 岁</span>
                                                        </div>
                                                        <div className="bg-white/60 p-2 rounded-lg border border-orange-50">
                                                            <span className="text-[9px] text-gray-400 block mb-0.5">拟推荐/现状</span>
                                                            <span className={`text-xs font-bold ${member.status && member.status !== '缺口' && member.status !== '待配置' ? 'text-green-500' : 'text-orange-500'}`}>{member.status && member.status !== '缺口' ? member.status : '需规划'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex justify-end">
                                                        <button className="text-[10px] bg-white border border-orange-200 text-orange-500 font-bold px-3 py-1 rounded-full shadow-sm hover:bg-orange-500 hover:text-white transition-all">
                                                            前往配置详情
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {(!customerData?.family_structure || customerData.family_structure.length === 0) && (
                                        <div className="text-center py-4">
                                            <p className="text-[10px] text-gray-400">暂无家庭成员记录</p>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FamilyStructurePanel;
