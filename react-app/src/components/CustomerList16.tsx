import React from 'react';
import CRMErrorState from './CRMErrorState';
import MobileBottomNav from './MobileBottomNav';

const CustomerList16: React.FC = () => {
    return (
        <div className="h-screen w-full flex flex-col bg-[#FFF9F5]">
            <div className="flex-1 overflow-hidden">
                <CRMErrorState hideNav={true} />
            </div>
            <MobileBottomNav />
        </div>
    );
};

export default CustomerList16;
