import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CompositeDigitalHumanChat from '../components/CompositeDigitalHumanChat/index';
import MobileBottomNav from '../components/MobileBottomNav';
import DigitalHumanSection from '../components/DigitalHumanSection';
import CRMErrorState from '../components/CRMErrorState';
import InsuranceProductList from '../components/InsuranceProductList/InsuranceProductList';
import UserProfile from '../components/UserProfile';
import CustomerProfilePanel from '../components/CustomerProfilePanel';
import { getClientDetail } from '../services/clientApi';
import type { CustomerProfile } from '../components/CustomerInfoCards';

// 定义 location state 类型
interface LocationState {
    initialMessage?: string;
    productContext?: any;
    compareProducts?: any[];
}

const CompositeChatFullPage: React.FC = () => {
    // 🔥 从router state获取初始消息
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state as LocationState | null;
    // 🔥 改为 state 管理，便于消费后清除
    const [initialMessage, setInitialMessage] = useState<string | undefined>(
        locationState?.initialMessage
    );

    // Current internal paths that we handle via state instead of navigation
    const [activeTab, setActiveTab] = useState('/composite-chat-full');
    const localTabs = ['/composite-chat-full', '/expert-library', '/customer-list-16', '/product-list', '/profile'];

    // State for Customer Detail View
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
    // 🔥 用于从产品列表触发AI对话的消息
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);

    // 注意：不再需要检测 initialMessage 自动切换 tab 的 useEffect
    // 因为内部 tab 切换已通过 pendingMessage + handleAiChat 处理
    // 外部路由跳转会直接到聊天 tab（默认路由）

    useEffect(() => {
        const fetchClientData = async () => {
            if (selectedClientId) {
                const profile = await getClientDetail(selectedClientId);
                setCustomerProfile(profile);
            }
        };
        fetchClientData();
    }, [selectedClientId]);

    const handleClientSelect = (clientId: number) => {
        setSelectedClientId(clientId);
        setActiveTab('/customer-detail');
        window.scrollTo(0, 0);
    };

    // 🔥 产品列表AI对话回调，切换tab并设置待发消息
    const handleAiChat = (message: string) => {
        console.log('🚀 [Page] 产品列表触发AI对话:', message);
        setPendingMessage(message);
        setActiveTab('/composite-chat-full');
    };

    // 🔥 Tab 切换时清除待发消息，防止残留
    const handleTabChange = (tab: string) => {
        // 如果切换到其他 tab，清除 pendingMessage 和 initialMessage
        if (tab !== '/composite-chat-full') {
            setPendingMessage(null);
            setInitialMessage(undefined);
        }
        setActiveTab(tab);
    };

    // 🔥 消息被消费后的回调
    const handleMessageConsumed = () => {
        console.log('✅ [Page] 消息已消费，清除 pendingMessage 和 initialMessage');
        setPendingMessage(null);
        // 🔥 关键：清除 location.state，防止页面返回时重复发送
        setInitialMessage(undefined);
        navigate(location.pathname, { replace: true, state: null });
    };

    const renderContent = () => {
        switch (activeTab) {
            case '/expert-library':
                return <DigitalHumanSection />;
            case '/customer-list-16':
                return <CRMErrorState hideNav={true} onClientSelect={handleClientSelect} />;
            case '/product-list':
                return <InsuranceProductList onAiChat={handleAiChat} />;
            case '/profile':
                return <UserProfile />;
            case '/customer-detail':
                return (
                    <div className="h-full w-full bg-[#FAFAFA] overflow-hidden flex flex-col">
                        {/* Simple Header for Detail View */}
                        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0">
                            <button
                                onClick={() => setActiveTab('/customer-list-16')}
                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 active:scale-95 transition-transform"
                            >
                                <i className="fa-solid fa-chevron-left text-gray-500 text-sm"></i>
                            </button>
                            <span className="font-bold text-gray-800">客户全景档案</span>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                            {customerProfile ? (
                                <CustomerProfilePanel
                                    className="w-full min-h-screen border-none shadow-none rounded-none bg-transparent p-4 pb-10"
                                    customerData={customerProfile}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-400">
                                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> 加载中...
                                </div>
                            )}
                        </div>
                    </div>
                );
            case '/composite-chat-full':
            default:
                return (
                    <CompositeDigitalHumanChat
                        initialMessage={pendingMessage || initialMessage}
                        onMessageConsumed={handleMessageConsumed}
                    />
                );
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#F9FAFB]">
            <div className="flex-1 relative overflow-hidden">
                {renderContent()}
            </div>
            {/* Hide bottom nav when in detail view if desired, but user said "still has a menu below" */}
            <MobileBottomNav
                activeTab={activeTab === '/customer-detail' ? '/customer-list-16' : activeTab}
                onTabChange={handleTabChange}
                localPaths={localTabs}
            />
        </div>
    );
};

export default CompositeChatFullPage;
