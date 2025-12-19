import React from 'react';
import CustomerProfilePanel from '../CustomerProfilePanel';
import type { CustomerProfile } from '../CustomerInfoCards';

interface CustomerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    customerProfile: CustomerProfile | null;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
    isOpen,
    onClose,
    customerProfile
}) => {
    return (
        <div
            className={`fixed inset-y-0 right-0 w-[85%] max-w-md bg-white shadow-2xl z-[60] flex flex-col border-l border-gray-100 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-[#FFF9F5]">
                <span className="text-sm font-bold text-gray-800">客户全景档案</span>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white text-gray-500 flex items-center justify-center hover:bg-gray-100"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <CustomerProfilePanel
                    className="w-full h-full"
                    customerData={customerProfile}
                />
            </div>
        </div>
    );
};
