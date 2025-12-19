import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Users, Bot, User } from 'lucide-react';

interface MobileBottomNavProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    localPaths?: string[];
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange, localPaths = [] }) => {
    const navItems = [
        { id: '/composite-chat-full', label: 'AI对话', icon: MessageSquare, path: '/composite-chat-full' },
        { id: '/product-list', label: '产品列表', icon: ShieldCheck, path: '/product-list' }, // Assume this is a normal navigation now
        { id: '/customer-list-16', label: '客户CRM', icon: Users, path: '/customer-list-16' },
        { id: '/expert-library', label: 'AI 专家', icon: Bot, path: '/expert-library' },
        { id: '/profile', label: '个人', icon: User, path: '/profile' },
    ];

    const handleClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
        if (onTabChange && localPaths.includes(item.path)) {
            e.preventDefault();
            onTabChange(item.path);
        }
    };

    return (
        <nav className="w-full bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-2 py-2 z-[100] safe-area-inset-bottom shadow-[0_-1px_10px_rgba(0,0,0,0.05)] shrink-0 h-[70px]">
            {navItems.map((item, index) => {
                const Icon = item.icon;
                const isItemActive = activeTab ? activeTab === item.id : false;

                return (
                    <NavLink
                        key={index}
                        to={item.path}
                        onClick={(e) => handleClick(e, item)}
                        className={({ isActive }) => {
                            const active = activeTab ? isItemActive : isActive;
                            return `flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ${active ? 'text-orange-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`;
                        }}
                    >
                        {({ isActive }) => {
                            const active = activeTab ? isItemActive : isActive;
                            return (
                                <>
                                    <div className="flex items-center justify-center">
                                        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-bold">{item.label}</span>
                                </>
                            );
                        }}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;
