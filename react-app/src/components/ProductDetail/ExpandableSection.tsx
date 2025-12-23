import React, { useState } from 'react';

interface ExpandableSectionProps {
    title: string;
    previewContent?: React.ReactNode;
    fullContent: React.ReactNode;
    dataLoaded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
    title,
    previewContent,
    fullContent,
    dataLoaded = true
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!dataLoaded) return null;

    return (
        <>
            {/* Card Preview */}
            <div
                className="bg-white rounded-xl p-5 shadow-sm mb-4 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold flex items-center text-gray-900">
                        <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                        {title}
                    </h3>
                    <div className="text-gray-400">
                        <span className="text-xs mr-1">查看详情</span>
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </div>
                </div>

                {previewContent ? (
                    <div className="opacity-80 pointer-events-none line-clamp-3">
                        {previewContent}
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 py-2">
                        点击查看详细内容...
                    </div>
                )}
            </div>

            {/* Full Screen Drawer/Modal */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer Content */}
            <div
                className={`fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] shadow-2xl z-[70] h-[85vh] flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 pb-24">
                    {fullContent}
                </div>
            </div>
        </>
    );
};

export default ExpandableSection;
