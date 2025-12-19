import React, { useState } from 'react';
import CompositeDigitalHumanChat from '../components/CompositeDigitalHumanChat';
import MobileBottomNav from '../components/MobileBottomNav';
import DigitalHumanSection from '../components/DigitalHumanSection';
import CRMErrorState from '../components/CRMErrorState';
import InsuranceProductList from '../components/InsuranceProductList/InsuranceProductList';
import UserProfile from '../components/UserProfile';

const CompositeChatFullPage: React.FC = () => {
    // Current internal paths that we handle via state instead of navigation
    const [activeTab, setActiveTab] = useState('/composite-chat-full');
    const localTabs = ['/composite-chat-full', '/expert-library', '/customer-list-16', '/product-list', '/profile'];

    const renderContent = () => {
        switch (activeTab) {
            case '/expert-library':
                return <DigitalHumanSection />;
            case '/customer-list-16':
                return <CRMErrorState hideNav={true} />;
            case '/product-list':
                return <InsuranceProductList />;
            case '/profile':
                return <UserProfile />;
            case '/composite-chat-full':
            default:
                return <CompositeDigitalHumanChat />;
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#F9FAFB]">
            <div className="flex-1 relative overflow-hidden">
                {renderContent()}
            </div>
            <MobileBottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                localPaths={localTabs}
            />
        </div>
    );
};

export default CompositeChatFullPage;
