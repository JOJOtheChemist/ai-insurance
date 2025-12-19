import React, { useState } from 'react';
import Header from './Header';
import BalanceCard from './BalanceCard';
import StatsGrid from './StatsGrid';
import ActionMenu from './ActionMenu';
import TopupModal from './TopupModal';

const UserProfile: React.FC = () => {
    const [isTopupOpen, setIsTopupOpen] = useState(false);

    return (
        <div className="h-full w-full bg-[#F9FAFB] overflow-y-auto no-scrollbar relative flex flex-col">
            {/* Header Background Gradient */}
            <div
                className="absolute top-0 left-0 w-full h-[260px] z-0"
                style={{ background: 'linear-gradient(180deg, #FFF7ED 0%, #F9FAFB 100%)' }}
            ></div>

            <Header />
            <BalanceCard onTopupClick={() => setIsTopupOpen(true)} />
            <StatsGrid />
            <ActionMenu />

            <TopupModal
                isOpen={isTopupOpen}
                onClose={() => setIsTopupOpen(false)}
            />
        </div>
    );
};

export default UserProfile;
