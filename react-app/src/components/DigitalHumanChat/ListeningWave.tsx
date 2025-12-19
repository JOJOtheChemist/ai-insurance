
import React from 'react';

export const ListeningWave: React.FC = () => {
    return (
        <div className="listening-wave z-20 mb-8 opacity-80 flex gap-1 items-center absolute bottom-20 left-1/2 -translate-x-1/2">
            <div className="wave-bar w-1 bg-emerald-500 rounded-full h-3 animate-[wave_1s_infinite_ease-in-out]"></div>
            <div className="wave-bar w-1 bg-emerald-500 rounded-full h-5 animate-[wave_1s_infinite_ease-in-out_0.1s]"></div>
            <div className="wave-bar w-1 bg-emerald-500 rounded-full h-8 animate-[wave_1s_infinite_ease-in-out_0.2s]"></div>
            <div className="wave-bar w-1 bg-emerald-500 rounded-full h-5 animate-[wave_1s_infinite_ease-in-out_0.1s]"></div>
            <div className="wave-bar w-1 bg-emerald-500 rounded-full h-3 animate-[wave_1s_infinite_ease-in-out]"></div>
        </div>
    );
};
