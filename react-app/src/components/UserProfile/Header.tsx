import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutBottomSheet from './LogoutBottomSheet';


const Header: React.FC = () => {
    const { user } = useAuth();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // 获取用户名首字母作为头像
    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <header className="px-4 pt-12 pb-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/30 border-2 border-white">
                    {getInitials(user?.username || 'User')}
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        {user?.username || '未登录用户'}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            黄金级会员
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">ID: {user?.id || '----'}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    console.log('Opening Account Actions Sheet');
                    setIsSheetOpen(true);
                }}
                className="w-12 h-12 rounded-full bg-white text-gray-400 flex items-center justify-center shadow-md border border-gray-100 hover:text-gray-600 active:bg-gray-100 active:scale-90 transition-all z-[100] relative cursor-pointer"
                title="账户设置"
            >
                <i className="fa-solid fa-gear text-xl"></i>
            </button>

            <LogoutBottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
        </header>
    );
};

export default Header;
