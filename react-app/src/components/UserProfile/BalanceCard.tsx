import React from 'react';

interface BalanceCardProps {
    onTopupClick: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ onTopupClick }) => {
    return (
        <section className="relative z-10 px-4 mb-8">
            <div className="member-card p-6 flex flex-col justify-between min-h-[190px] relative overflow-hidden rounded-[24px] shadow-[0_12px_40px_-5px_rgba(31,41,55,0.4)]"
                style={{
                    background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
                    color: '#FDE68A'
                }}>

                {/* Decorative Texture */}
                <div className="absolute top-[-50%] right-[-20%] w-[250px] h-[250px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(253, 230, 138, 0.15) 0%, transparent 70%)'
                    }}></div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="text-xs text-yellow-100/60 uppercase tracking-widest mb-2 font-bold">AI 算力余额 (Tokens)</div>
                        <div className="text-4xl font-black text-white flex items-baseline gap-1.5">
                            2,450
                            <span className="text-base font-medium text-yellow-100/60">点</span>
                        </div>
                    </div>
                    <div
                        className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
                        <span className="text-xs text-yellow-100 font-bold">至 2025.12.31</span>
                        <i className="fa-solid fa-chevron-right text-[10px] text-yellow-100/50"></i>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-xs text-yellow-100/80 font-medium">
                            <i className="fa-solid fa-fire text-orange-500 mr-1.5"></i>
                            今日已消耗 320 点
                        </span>
                    </div>
                    <button
                        onClick={onTopupClick}
                        className="px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 shadow-xl shadow-orange-500/30 active:scale-95 transition-all hover:brightness-110"
                        style={{
                            background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                            color: 'white'
                        }}>
                        立即充值
                        <i className="fa-solid fa-bolt"></i>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BalanceCard;
