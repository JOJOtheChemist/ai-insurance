import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white sticky top-0 z-20 px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-4">
                <button className="w-8 h-8 flex items-center justify-center text-gray-700">
                    <i className="fa-solid fa-chevron-left text-lg"></i>
                </button>
                <h1 className="text-lg font-bold text-gray-900">保险专家库</h1>
                <button className="w-8 h-8 flex items-center justify-center text-gray-700">
                    <i className="fa-regular fa-bell text-lg"></i>
                </button>
            </div>
            <div className="h-11 bg-gray-100 rounded-xl flex items-center px-4 mb-2">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm mr-2"></i>
                <input type="text" placeholder="搜索专家、案例话题..."
                    className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
            </div>
        </header>
    );
};

export default Header;
