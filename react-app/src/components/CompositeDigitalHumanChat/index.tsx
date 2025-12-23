import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InputArea } from '../DigitalHumanChat/InputArea';
import ClientSelector from '../ClientSelector';
import type { ClientListItem } from '../../services/clientApi';
import {
    CompactHeader,
    AvatarStage,
    WelcomeView,
    ChatView,
    CustomerDrawer,
    HistoryDrawer
} from '../CompositeChat';

// Import types
import type { CompositeDigitalHumanChatProps, Stage } from './types';

// Import custom hooks
import {
    useSessionManagement,
    useClientManagement,
    useChatMessages,
    useStageManagement
} from './hooks';

const CompositeDigitalHumanChat: React.FC<CompositeDigitalHumanChatProps> = ({
    initialMessage,
    onMessageConsumed
}) => {
    const { token, user } = useAuth();

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

    // Session management
    const { sessionId, sessionIdRef, handleNewChat, handleSelectSession } = useSessionManagement();

    // Client management
    const {
        customerProfile,
        setCustomerProfile,
        selectedClient,
        isSelectorOpen,
        setIsSelectorOpen,
        isCustomerMounted,
        setIsCustomerMounted,
        loadClientData,
        openClientSelector,
        handleSelectClient: handleSelectClientBase
    } = useClientManagement(sessionId);

    //  Initialize stage state first (needed by useChatMessages)
    const [stage, setStage] = useState<Stage>(0);

    // Chat messages (pass stage and setStage)
    const {
        messages,
        setMessages,
        handleStartChat
    } = useChatMessages({
        sessionId,
        token,
        stage,
        setStage,
        customerProfile,
        setCustomerProfile,
        setIsCustomerMounted,
        selectedClient,
        user
    });

    // Stage management effects (handles scroll and overflow detection based on messages)
    const {
        messagesEndRef,
        chatContainerRef,
        getChatSheetClasses
    } = useStageManagement(messages, stage, setStage);

    // Enhanced client selection handler
    const handleSelectClient = async (client: ClientListItem) => {
        await handleSelectClientBase(
            client,
            (newSessionId) => {
                sessionIdRef.current = newSessionId;
            },
            () => {
                setMessages([]);
            }
        );
        // Auto open drawer after client selection
        setIsDrawerOpen(true);
    };

    // 🔥 初始加载客户数据
    useEffect(() => {
        loadClientData();
    }, [loadClientData]);

    // 🔥 自动触发首轮对话（如果有 initialMessage）
    useEffect(() => {
        const messageKey = `initial_msg_sent_${sessionId}`;
        const alreadySent = sessionStorage.getItem(messageKey);

        if (initialMessage && !alreadySent && stage === 0) {
            console.log('🚀 [Chat] 自动触发首轮对话:', initialMessage);
            sessionStorage.setItem(messageKey, 'true');
            setTimeout(() => {
                handleStartChat(initialMessage);
                if (onMessageConsumed) {
                    onMessageConsumed();
                }
            }, 100);
        }
    }, [initialMessage, stage, onMessageConsumed, handleStartChat, sessionId]);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const toggleHistoryDrawer = () => setIsHistoryDrawerOpen(!isHistoryDrawerOpen);

    return (
        <div className="h-full w-full relative bg-[#F5F5F7] overflow-hidden font-sans">
            {/* Compact Header (Stage 2) */}
            <CompactHeader
                stage={stage}
                customerProfile={customerProfile}
                onDrawerToggle={toggleDrawer}
                onHistoryDrawerToggle={toggleHistoryDrawer}
                onNewChat={handleNewChat}
            />

            {/* Avatar Stage (Stage 0 & 1) */}
            <AvatarStage
                stage={stage}
                isCustomerMounted={isCustomerMounted}
                customerProfile={selectedClient || customerProfile}
                onHistoryDrawerToggle={toggleHistoryDrawer}
                onCustomerMount={openClientSelector}
                onCustomerCardClick={toggleDrawer}
            />

            {/* Chat Sheet Container */}
            <div
                className={`flex flex-col absolute left-0 w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) z-20 ${getChatSheetClasses()}`}
            >
                {/* Handle (Start only) */}
                <div className={`w-full flex justify-center pt-3 pb-1 shrink-0 ${stage === 2 ? 'hidden' : ''}`}>
                    <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                </div>

                {/* Welcome View (Stage 0) */}
                <WelcomeView
                    stage={stage}
                    isCustomerMounted={isCustomerMounted}
                    customerProfile={customerProfile}
                    onPromptClick={handleStartChat}
                />

                {/* Chat View (Stage 1 & 2) */}
                <ChatView
                    stage={stage}
                    messages={messages}
                    chatContainerRef={chatContainerRef}
                    messagesEndRef={messagesEndRef}
                />
            </div>

            {/* Input Area */}
            <InputArea onSend={handleStartChat} />

            {/* Customer Drawer */}
            <CustomerDrawer
                isOpen={isDrawerOpen}
                onClose={toggleDrawer}
                customerProfile={customerProfile}
                onRefresh={loadClientData}
            />

            {/* History Drawer */}
            <HistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={toggleHistoryDrawer}
                customerProfile={customerProfile}
                onNewChat={handleNewChat}
                onSelectSession={handleSelectSession}
            />

            {/* Combined Overlay */}
            {(isDrawerOpen || isHistoryDrawerOpen) && (
                <div
                    onClick={() => { setIsDrawerOpen(false); setIsHistoryDrawerOpen(false); }}
                    className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity"
                ></div>
            )}

            {/* 客户选择器 */}
            <ClientSelector
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelectClient={handleSelectClient}
                salespersonId={1}
            />
        </div>
    );
};

export default CompositeDigitalHumanChat;
