
import React from 'react';
import { ListeningWave } from './ListeningWave';

interface AvatarViewportProps {
    minimized?: boolean;
}

export const AvatarViewport: React.FC<AvatarViewportProps> = ({ minimized }) => {
    return (
        <div className={`avatar-stage w-full flex justify-center items-end overflow-hidden relative bg-[radial-gradient(circle_at_center,_#374151_0%,_#111827_100%)] transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${minimized ? 'h-[140px]' : 'h-[45vh]'}`}>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 text-white/80">
                <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center">
                    <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold">张伟 AI · 在线</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center">
                    <i className="fa-solid fa-volume-high"></i>
                </button>
            </div>

            {/* Avatar Image */}
            <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang&style=circle"
                className={`rounded-full border-4 border-white/10 shadow-2xl z-10 transition-all duration-700 ease-out origin-bottom ${minimized ? 'w-48 h-48 scale-75 translate-y-3 opacity-90' : 'w-48 h-48 mb-6 scale-125'}`}
                alt="AI Avatar"
            />

            {/* Gradient Overlay */}
            <div className={`absolute bottom-0 w-full bg-gradient-to-t from-[#1F2937] to-transparent z-10 transition-all duration-500 ${minimized ? 'h-12' : 'h-32'}`}></div>

            {/* Listening Animation - Only show when not minimized or maybe always? HTML shows it always but positioned differently */}
            {/* For simplicity adapting to "listening" concept, maybe hide when chat active if not speaking? 
                HTML keeps it but layout might cover it. Let's keep it but adjust z-index or position if needed.
                Actually HTML removes it or it's just overlaid. 
                Let's keep it simple.
             */}
            {!minimized && (
                <>
                    <ListeningWave />
                    <p className="absolute bottom-16 text-xs text-white/60 font-medium z-20">正在聆听...</p>
                </>
            )}
        </div>
    );
};
