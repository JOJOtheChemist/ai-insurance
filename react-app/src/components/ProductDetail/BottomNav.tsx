import React from 'react';

interface BottomNavProps {
    onConsultClick?: () => void;
    onGenerateClick?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onConsultClick, onGenerateClick }) => {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white px-5 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex gap-4 z-50">
            <button
                onClick={onConsultClick}
                className="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold text-sm active:bg-gray-100 transition-colors flex items-center justify-center"
            >
                <i className="fa-solid fa-robot mr-1.5 text-blue-500"></i>
                咨询AI顾问
            </button>
            <button
                onClick={onGenerateClick}
                className="flex-1 py-3 rounded-full bg-red-600 text-white font-semibold text-sm shadow-lg shadow-red-600/30 active:bg-red-700 transition-colors flex items-center justify-center"
            >
                <i className="fa-solid fa-file-signature mr-1.5"></i>
                生成计划书
            </button>
        </nav>
    );
};

export default BottomNav;
