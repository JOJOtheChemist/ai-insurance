import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroupedSessions, type HistoryResponse, type ClientSessionGroup, type SessionSummary } from '../services/clientApi';

interface CRMErrorStateProps {
    hideNav?: boolean;
    onClientSelect?: (clientId: number) => void;
}

const CRMErrorState: React.FC<CRMErrorStateProps> = ({ hideNav = false, onClientSelect }) => {
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState<number | null>(0); // Highlight/Expand card style
    const [historyVisible, setHistoryVisible] = useState<{ [key: number]: boolean }>({});
    // For session list folding logic (limit 3) inside the history section
    const [expandedSessionLists, setExpandedSessionLists] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await getGroupedSessions();
                setHistoryData(data);
                // Default expand history for the first client if exists
                if (data && data.groups.length > 0) {
                    setHistoryVisible({ [data.groups[0].client.id]: true });
                    setExpandedCard(data.groups[0].client.id);
                }
            } catch (error) {
                console.error("Failed to load CRM data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleHistory = (clientId: number) => {
        setHistoryVisible(prev => ({ ...prev, [clientId]: !prev[clientId] }));
        if (expandedCard !== clientId) {
            setExpandedCard(clientId);
        }
    };

    const toggleSessionList = (clientId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedSessionLists(prev => ({ ...prev, [clientId]: !prev[clientId] }));
    };

    const renderSessionItem = (session: SessionSummary) => (
        <div key={session.id}
            onClick={(e) => {
                e.stopPropagation();
                sessionStorage.setItem('insure_chat_session_id', session.id);
                // Force reload/navigation to ensure chat component picks up the new session
                window.location.href = '/composite-chat-full';
            }}
            className="bg-gray-50 rounded-lg p-3 flex items-start gap-2 border border-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-100 transition-colors group/session"
        >
            <div className="mt-0.5 text-gray-400 group-hover/session:text-orange-400">
                <i className="fa-solid fa-comment-dots text-xs"></i>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <p className="text-xs text-gray-800 line-clamp-1 group-hover/session:text-gray-900 font-medium">{session.summary}</p>
                    <span className="text-[9px] text-gray-400 shrink-0 ml-2 mt-0.5">{session.time}</span>
                </div>
            </div>
        </div>
    );

    const renderClientCard = (group: ClientSessionGroup) => {
        const clientId = group.client.id;
        const isHistoryShown = historyVisible[clientId];

        // Session List Folding Logic
        const isListExpanded = expandedSessionLists[clientId] || false;
        const visibleSessions = isListExpanded ? group.sessions : group.sessions.slice(0, 3);
        const hasMoreSessions = group.sessions.length > 3;

        return (
            <div
                key={clientId}
                onClick={() => {
                    if (onClientSelect) {
                        onClientSelect(clientId);
                    } else {
                        navigate('/customer-profile');
                    }
                }}
                className="bg-white rounded-[20px] p-4 relative overflow-hidden transition-all duration-100 active:scale-[0.99] border-2 border-transparent hover:border-orange-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer group"
            >
                {/* Header & Main Info - Compact Horizontal Layout */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-2">
                        {/* Avatar & Name Row */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-orange-100">
                                {group.client.avatar_char}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    {group.client.name}
                                    <span className="bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded border border-orange-100 font-medium">
                                        {group.client.role || '客户'}
                                    </span>
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                        {group.client.status || '高意向'}
                                    </span>
                                    <span className="text-[10px] text-gray-300">
                                        Active: {group.sessions[0]?.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics - Shifted to Right Side */}
                    <div className="flex gap-2">
                        <div className="bg-[#F9FAFB] rounded-lg p-2 flex flex-col items-center justify-center min-w-[60px]">
                            <div className="text-[9px] text-gray-400 mb-0.5 font-bold uppercase">年预算</div>
                            <div className="text-sm font-black text-gray-800">
                                {group.client.annual_budget || '-'}
                            </div>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-lg p-2 flex flex-col items-center justify-center min-w-[60px]">
                            <div className="text-[9px] text-gray-400 mb-0.5 font-bold uppercase">方案数</div>
                            <div className="text-sm font-black text-gray-800">
                                {group.sessions.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags - Cleaner Row */}
                <div className="flex flex-wrap gap-1.5 mb-4 pl-[52px]">
                    <span className="text-[10px] px-2 py-0.5 rounded-full border text-orange-600 bg-white border-orange-100 shadow-sm">
                        VIP客户
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border text-gray-500 bg-white border-gray-100 shadow-sm">
                        已婚育
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border text-gray-500 bg-white border-gray-100 shadow-sm">
                        家庭顶梁柱
                    </span>
                </div>

                {/* Action Bar */}
                <div className="border-t border-[#F3F4F6] mt-3 pt-4 flex flex-col gap-3">
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const newSessionId = `session-${Date.now()}`;
                                sessionStorage.setItem('insure_chat_session_id', newSessionId);
                                window.location.href = '/composite-chat-full';
                            }}
                            className="flex-1 bg-gray-900 text-white py-2.5 rounded-full text-xs font-bold shadow-md shadow-gray-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-black"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                            为TA制定方案
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleHistory(clientId);
                            }}
                            className="px-4 py-2.5 rounded-full border border-orange-200 bg-white text-orange-600 text-xs font-bold flex items-center gap-1 hover:bg-orange-50 transition-colors shadow-sm"
                        >
                            历史 <i className={`fa-solid ${isHistoryShown ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px] ml-1 transition-transform`}></i>
                        </button>
                    </div>

                    {isHistoryShown && (
                        <div className="history-list space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div className="text-[10px] text-gray-300 font-bold mb-2 uppercase tracking-wider pl-1">Recent Sessions</div>

                            {visibleSessions.map(renderSessionItem)}

                            {hasMoreSessions && (
                                <div
                                    onClick={(e) => toggleSessionList(clientId, e)}
                                    className="text-[10px] text-gray-400 text-center py-2 cursor-pointer hover:text-orange-500 transition-colors flex items-center justify-center gap-1 bg-gray-50/50 rounded-lg border border-transparent hover:border-orange-100 hover:bg-orange-50/30"
                                >
                                    <span>{isListExpanded ? '收起会话' : `展开更多 (${group.sessions.length - 3})`}</span>
                                    <i className={`fa-solid fa-chevron-${isListExpanded ? 'up' : 'down'}`}></i>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col text-[#5C4B41] bg-gray-50 font-['Noto_Sans_SC']">
            {/* Header */}
            <header className="px-5 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
                <h1 className="text-xl font-bold mb-3 text-gray-900">我的客户 <span className="text-sm font-normal text-gray-400 ml-1">({historyData?.groups.length || 0})</span></h1>

                <div className="flex gap-3">
                    <div className="flex-1 h-10 bg-gray-50 rounded-full flex items-center px-4 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
                        <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs mr-2"></i>
                        <input type="text" placeholder="搜索姓名、标签..."
                            className="bg-transparent text-sm outline-none flex-1 text-gray-800 placeholder-gray-400" />
                    </div>
                </div>

                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                    <button className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-bold shadow-sm">全部</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs whitespace-nowrap">高意向</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs whitespace-nowrap">待跟进</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 no-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-10 text-gray-400">
                        <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> 加载客户数据...
                    </div>
                ) : (
                    <>
                        {historyData?.groups.map(renderClientCard)}

                        {(!historyData?.groups || historyData.groups.length === 0) && (
                            <div className="text-center py-10 text-gray-400 text-sm">暂无客户数据</div>
                        )}

                        <div className="client-card p-5 flex items-center justify-center text-gray-300 text-sm">
                            --- 没有更多了 ---
                        </div>
                    </>
                )}
            </main>

            {/* Navigation */}
            {!hideNav && (
                <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 h-16 flex justify-around items-center z-30 pb-2">
                    <a href="#" className="flex flex-col items-center gap-1 text-gray-900">
                        <i className="fa-solid fa-address-book text-xl"></i>
                        <span className="text-[10px] font-bold">客户</span>
                    </a>
                    <a href="#" className="flex flex-col items-center gap-1 text-gray-400">
                        <i className="fa-solid fa-robot text-xl"></i>
                        <span className="text-[10px] font-bold">助理</span>
                    </a>
                    <a href="#" className="flex flex-col items-center gap-1 text-gray-400">
                        <i className="fa-solid fa-user text-xl"></i>
                        <span className="text-[10px] font-bold">我的</span>
                    </a>
                </nav>
            )}
        </div>
    );
};

export default CRMErrorState;
