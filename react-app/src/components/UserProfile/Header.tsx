import React from 'react';
import { useAuth } from '../../context/AuthContext';


const Header: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="relative z-10 px-5 pt-12 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-200">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'SalesUser'}`} className="w-full h-full" alt="Avatar" />
                    </div>
                    <div
                        className="absolute bottom-0 right-1 w-6 h-6 bg-gray-900 rounded-full border-2 border-white flex items-center justify-center text-white text-[12px]">
                        <i className="fa-solid fa-camera"></i>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">{user?.username || '未登录'}</h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-gray-500 font-medium">ID: {user?.id || '------'}</span>
                        <span
                            className="px-2 py-0.5 bg-gray-900 text-[#FDE68A] text-[10px] font-bold rounded flex items-center gap-1">
                            <i className="fa-solid fa-crown"></i> PRO 会员
                        </span>
                    </div>
                </div>
            </div>

            <button
                className="w-9 h-9 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-sm border border-gray-100 hover:text-gray-600">
                <i className="fa-solid fa-gear"></i>
            </button>
        </header>
    );
};

export default Header;
