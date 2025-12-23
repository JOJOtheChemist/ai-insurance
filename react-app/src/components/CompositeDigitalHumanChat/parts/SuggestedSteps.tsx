
import React from 'react';

export interface SuggestedStepsProps {
    steps: string[];
    onStep: (step: string) => void;
}

export const SuggestedSteps: React.FC<SuggestedStepsProps> = ({ steps, onStep }) => (
    <div className="mt-4 pt-3 border-t border-gray-100 animate-fadeIn">
        <p className="text-xs font-bold text-gray-400 mb-3 pl-1 tracking-wide uppercase">Suggested Actions</p>
        <div className="flex flex-col gap-2">
            {steps.map((step, idx) => (
                <button
                    key={idx}
                    onClick={() => onStep(step)}
                    className="group relative overflow-hidden text-left w-full px-4 py-3 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex items-center justify-between"
                >
                    <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="relative z-10 flex-1">{step}</span>
                    <i className="relative z-10 fa-solid fa-arrow-right text-gray-300 group-hover:text-blue-500 transition-colors duration-200 -translate-x-2 group-hover:translate-x-0 transform" />
                </button>
            ))}
        </div>
    </div>
);
