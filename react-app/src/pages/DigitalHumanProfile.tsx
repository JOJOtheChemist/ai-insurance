import React from 'react';
import ProfileHeader from '../components/digital-human/ProfileHeader';
import ProfileInfo from '../components/digital-human/ProfileInfo';
import StatsBar from '../components/digital-human/StatsBar';
import CaseList from '../components/digital-human/CaseList';
import StickyFooter from '../components/digital-human/StickyFooter';
import MobileBottomNav from '../components/MobileBottomNav';

const DigitalHumanProfile: React.FC = () => {
    return (
        <div className="h-screen flex flex-col bg-[#F7F8FA] font-['Noto_Sans_SC'] relative overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-32">
                <div className="relative bg-white pb-6 rounded-b-[32px] shadow-sm z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
                    <ProfileHeader />
                    <ProfileInfo />
                    <StatsBar />
                </div>

                <CaseList />
                <StickyFooter />
            </div>

            <MobileBottomNav activeTab="/expert-library" />
        </div>
    );
};

export default DigitalHumanProfile;
