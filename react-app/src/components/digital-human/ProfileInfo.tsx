import React from 'react';

const ProfileInfo: React.FC = () => {
    return (
        <div className="px-5 mt-2 flex gap-4">
            <div className="relative w-24 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0 group cursor-pointer">
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                    alt="Avatar"
                    className="w-full h-full object-cover bg-blue-50"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center pl-0.5 shadow-lg">
                        <i className="fa-solid fa-play text-xs text-blue-600"></i>
                    </div>
                </div>
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[8px] px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap">
                    自我介绍
                </div>
            </div>

            <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                    <h1 className="text-xl font-bold text-gray-900">张伟</h1>
                    <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <div className="ai-pulse" style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#10B981',
                            borderRadius: '50%',
                            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                            animation: 'pulse-green 2s infinite'
                        }}></div>
                        <span className="text-[10px] font-bold text-green-700">AI 在线</span>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-1 mb-2">友邦保险 · 资深区域总监</p>

                <div className="flex flex-wrap gap-2 mb-3">
                    <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
                            color: '#B47D00',
                            border: '1px solid #FFE082'
                        }}
                    >
                        MDRT 终身会员
                    </span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] border border-gray-200">从业12年</span>
                </div>
            </div>
            <style>{`
        @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
        </div>
    );
};

export default ProfileInfo;
