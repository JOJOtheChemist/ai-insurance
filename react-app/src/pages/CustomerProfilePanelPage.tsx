import React from 'react';
import CustomerProfilePanel from '../components/CustomerProfilePanel';

const CustomerProfilePanelPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 py-10 px-6 flex justify-center overflow-auto font-['Noto_Sans_SC']">
            <CustomerProfilePanel />
        </div>
    );
};

export default CustomerProfilePanelPage;
