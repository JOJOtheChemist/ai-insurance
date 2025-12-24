import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LogoutBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutBottomSheet: React.FC<LogoutBottomSheetProps> = ({ isOpen, onClose }) => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    };

    const handleLogin = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Sheet */}
            <div
                className={`relative w-full max-w-md bg-white rounded-t-[32px] p-6 shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
            >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

                <h3 className="text-xl font-black text-gray-900 mb-2 text-center">账户设置</h3>
                <p className="text-sm text-gray-500 mb-8 text-center px-4">请选择您要执行的操作</p>

                <div className="space-y-3">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            退出当前登录
                        </button>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
                        >
                            <i className="fa-solid fa-user"></i>
                            前往登录
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutBottomSheet;
