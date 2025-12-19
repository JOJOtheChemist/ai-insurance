import React from 'react';

const StickyFooter: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-100 px-5 py-3 pb-6 absolute bottom-0 left-0 w-full z-30 flex items-center gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
            <button className="flex flex-col items-center gap-0.5 text-gray-500 px-2">
                <i className="fa-regular fa-heart text-lg"></i>
                <span className="text-[10px]">收藏</span>
            </button>

            <button className="flex-1 bg-gray-900 text-white rounded-xl h-11 flex items-center justify-center gap-2 shadow-lg shadow-gray-300 active:scale-95 transition-transform">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-bold text-sm">向张伟提问</span>
            </button>
        </footer>
    );
};

export default StickyFooter;
