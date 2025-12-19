
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };



    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h1 className={`font-bold text-lg text-gray-800 transition-opacity whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                        }`}>
                        Templates
                    </h1>
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-list'}`}></i>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
                    <NavLink to="/customer-list-16" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        16. 客户列表 (Main)
                    </NavLink>

                    <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Batch 1</div>

                    <NavLink to="/mobile-chat-layout" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        10. 手机对话排版
                    </NavLink>
                    <NavLink to="/mobile-chat-interface" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        11. 手机对话界面2
                    </NavLink>
                    <NavLink to="/ai-role-intro" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        12. AI角色介绍
                    </NavLink>
                    <NavLink to="/crm-error-state" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        13. CRM错误状态
                    </NavLink>
                    <NavLink to="/crm-main" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        14. 客户关系管理
                    </NavLink>
                    <NavLink to="/customer-list-15" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        15. 客户列表 (清爽)
                    </NavLink>

                    <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Batch 2</div>

                    <NavLink to="/customer-card-1" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        16-1. 客户卡片1
                    </NavLink>
                    <NavLink to="/customer-card-2" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        16-2. 客户卡片2
                    </NavLink>
                    <NavLink to="/crm-full" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        1. CRM完整版
                    </NavLink>
                    <NavLink to="/quick-info-guide" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        2. 快捷信息引导
                    </NavLink>
                    <NavLink to="/script-card-comparison" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        3. 话术对比卡片
                    </NavLink>

                    <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Batch 3</div>

                    <NavLink to="/script-card-single" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        4. 话术卡片 (独立)
                    </NavLink>
                    <NavLink to="/crm-card" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        5. CRM卡片
                    </NavLink>
                    <NavLink to="/optimized-customer-card" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        6. 优化客户卡片
                    </NavLink>
                    <NavLink to="/dual-card" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        7. 双卡片布局
                    </NavLink>
                    <NavLink to="/plan-recommendation-card" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        8. 方案推荐卡片
                    </NavLink>
                    <NavLink to="/history-records" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        9. 历史记录
                    </NavLink>

                    <div className="pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">New</div>

                    <NavLink to="/composite-customer-profile" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        10. 合成客户卡片
                    </NavLink>
                    <NavLink to="/customer-profile-panel" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        10+. 客户画像独立页
                    </NavLink>
                    <NavLink to="/ai-workspace" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        18. 智能协同工作台
                    </NavLink>
                    <NavLink to="/digital-human-profile" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        11. 数字人个人页面
                    </NavLink>
                    <NavLink to="/digital-human-chat" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        12. 数字人对话界面
                    </NavLink>

                    <NavLink to="/digital-human-chat-switch" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        14. 数字人对话 (切换版)
                    </NavLink>
                    <NavLink to="/digital-human-chat-screen-efficiency" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        15. 屏幕利用率优化
                    </NavLink>
                    <NavLink to="/digital-human-chat-context" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        16. 带客户档案对话
                    </NavLink>
                    <NavLink to="/composite-chat" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        17. 合成对话界面 (最终版)
                    </NavLink>
                    <NavLink to="/expert-list" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                        13. 保险专家列表
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
