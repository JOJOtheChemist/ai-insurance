import React, { useEffect, useState } from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';
import { getGroupedSessions, type HistoryResponse, type ClientSessionGroup, type SessionSummary } from '../../services/clientApi';

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    customerProfile: CustomerProfile | null;
    onNewChat: () => void;
    onSelectSession: (sessionId: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
    isOpen,
    onClose,
    customerProfile,
    onNewChat,
    onSelectSession
}) => {
    const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        setLoading(true);
        const data = await getGroupedSessions();
        setHistoryData(data);
        setLoading(false);
    };

    const renderSessionCard = (session: SessionSummary, clientName: string, isGroupHover: boolean) => (
        <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className="bg-gray-50 rounded-lg p-3 flex items-start gap-2 border border-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors group/session"
        >
            <div className={`mt-0.5 text-gray-400 group-hover/session:text-orange-400 ${isGroupHover ? 'text-orange-300' : ''}`}>
                <i className="fa-solid fa-comment-dots text-xs"></i>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <p className="text-xs text-gray-800 line-clamp-1 group-hover/session:text-gray-900 font-medium">{session.summary}</p>
                    <span className="text-[9px] text-gray-400 shrink-0 ml-2 mt-0.5">{session.time}</span>
                </div>
                {/* <p className="text-[10px] text-gray-400 mt-0.5">点击进入会话</p> */}
            </div>
        </div>
    );

    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

    const toggleGroup = (clientId: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [clientId]: !prev[clientId]
        }));
    };

    const renderClientGroup = (group: ClientSessionGroup) => {
        const isExpanded = expandedGroups[group.client.id] || false;
        const visibleSessions = isExpanded ? group.sessions : group.sessions.slice(0, 3);
        const hasMore = group.sessions.length > 3;

        return (
            <div key={group.client.id} className="bg-white rounded-[16px] border border-[#F3F4F6] transition-all hover:shadow-sm p-3 flex flex-col gap-3 shadow-sm group">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center w-full">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-base font-bold shadow-sm border border-white/20 shrink-0">
                            {group.client.avatar_char}
                        </div>

                        {/* Info Block */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{group.client.name}</h3>
                                <span className="px-[6px] py-[1px] rounded-[4px] text-[10px] font-medium bg-gray-100 text-gray-500 shrink-0">
                                    {group.sessions.length}个会话
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                <span>{group.client.role || '暂无角色'}</span>
                                <span className="w-0.5 h-2.5 bg-gray-200"></span>
                                <span>{group.client.annual_budget ? `预算${group.client.annual_budget}` : '预算待定'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {visibleSessions.map(session => renderSessionCard(session, group.client.name, false))}

                    {hasMore && (
                        <div
                            onClick={() => toggleGroup(group.client.id)}
                            className="text-[10px] text-gray-400 text-center py-2 cursor-pointer hover:text-orange-500 transition-colors flex items-center justify-center gap-1 bg-gray-50/50 rounded-lg border border-transparent hover:border-orange-100 hover:bg-orange-50/30"
                        >
                            <span>{isExpanded ? '收起会话' : `展开更多 (${group.sessions.length - 3})`}</span>
                            <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderUnassignedGroup = (sessions: SessionSummary[]) => (
        <div key="unassigned" className="bg-white rounded-[16px] border border-[#F3F4F6] p-4 flex flex-col gap-3 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-base font-bold border border-gray-200">
                        <i className="fa-solid fa-user-secret"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">未归属客户</h3>
                            <span className="px-[6px] py-[2px] rounded-[4px] text-[10px] font-medium bg-gray-100 text-gray-500">
                                {sessions.length}个会话
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">尚未关联特定客户档案的会话</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {sessions.map(session => renderSessionCard(session, 'Unassigned', false))}
            </div>
        </div>
    );

    return (
        <div
            className={`fixed inset-y-0 left-0 w-[85%] max-w-md bg-[#F9FAFB] shadow-2xl z-[60] flex flex-col border-r border-gray-100 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white sticky top-0 z-10">
                <span className="text-sm font-bold text-gray-800">历史会话</span>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                <div
                    onClick={onNewChat}
                    className="bg-white rounded-[16px] border border-dashed border-gray-300 p-3 flex items-center justify-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-all text-gray-400 gap-2 mb-2"
                >
                    <i className="fa-solid fa-plus"></i>
                    <span className="text-xs font-bold">开启新会话</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <i className="fa-solid fa-circle-notch fa-spin text-xl mb-2"></i>
                        <span className="text-xs">加载历史会话...</span>
                    </div>
                ) : (
                    <>
                        {historyData?.groups.map(renderClientGroup)}
                        {historyData?.unassigned && historyData.unassigned.length > 0 && renderUnassignedGroup(historyData.unassigned)}

                        {!historyData?.groups.length && !historyData?.unassigned.length && (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                <i className="fa-solid fa-inbox text-3xl mb-2"></i>
                                <span className="text-xs">暂无历史会话</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
