import React from 'react';

interface TopupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TopupModal: React.FC<TopupModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm flex items-end justify-center animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">补充 AI 算力</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-100 rounded-full text-gray-500 flex items-center justify-center active:scale-90 transition-transform">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    <label
                        className="flex items-center justify-between p-4 border-2 border-orange-500 bg-orange-50 rounded-xl cursor-pointer relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-br-lg font-bold">
                            最推荐</div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-4 border-orange-500"></div>
                            <div>
                                <div className="font-bold text-gray-900">专业版月卡</div>
                                <div className="text-xs text-gray-500">无限次基础对话 + 300次高级分析</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-orange-600">¥99</div>
                            <div className="text-[10px] text-gray-400 line-through">¥199</div>
                        </div>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-gray-300"></div>
                            <div>
                                <div className="font-bold text-gray-900">加油包 (1000点)</div>
                                <div className="text-xs text-gray-500">有效期 90 天</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-gray-900">¥49</div>
                        </div>
                    </label>
                </div>

                <button
                    className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg text-sm flex items-center justify-center gap-2 active:bg-gray-800 active:scale-[0.98] transition-all">
                    <i className="fa-brands fa-weixin"></i> 立即支付 ¥99
                </button>
            </div>
        </div>
    );
};

export default TopupModal;
