import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface ExpertProps {
    id: number;
    name: string;
    avatar: string;
    isAi: boolean;
    consultationCount: string;
    caseCount: number;
    title: string;
    tags: { label: string; type: 'gold' | 'gray' | 'pink' }[];
    casePreview?: {
        icon: string; // font awesome class
        category: string;
        title: string;
        themeColor: 'orange' | 'pink' | 'gray';
    };
    gender?: 'female' | 'male'; // to adjust styling if needed, though mostly color based
    buttonStyle?: 'primary' | 'outline';
}

const ExpertCard: React.FC<ExpertProps> = ({
    name,
    avatar,
    isAi,
    consultationCount,
    caseCount,
    title,
    tags,
    casePreview,
    buttonStyle = 'outline'
}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate('/digital-human-profile');
    };
    // Helper to get case preview styles based on color
    const getCaseReviewStyle = (color: string) => {
        switch (color) {
            case 'orange':
                return {
                    bar: 'group-hover:bg-orange-50/50 group-hover:border-orange-100',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-500',
                    hoverIcon: 'group-hover:text-orange-400'
                };
            case 'pink':
                return {
                    bar: 'hover:bg-pink-50/30 hover:border-pink-100',
                    iconBg: 'bg-pink-100',
                    iconColor: 'text-pink-500',
                    hoverIcon: ''
                };
            case 'gray':
            default:
                return {
                    bar: 'hover:bg-gray-100',
                    iconBg: 'bg-gray-200',
                    iconColor: 'text-gray-500',
                    hoverIcon: ''
                };
        }
    };

    const caseStyle = casePreview ? getCaseReviewStyle(casePreview.themeColor) : null;

    return (
        <div
            className="expert-card p-4 relative overflow-hidden group cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex gap-4 mb-3">
                <div className="relative shrink-0">
                    <div className={`w-14 h-14 rounded-full overflow-hidden border border-gray-100 ${casePreview?.themeColor === 'pink' ? 'bg-pink-50' : (casePreview?.themeColor === 'orange' ? 'bg-blue-50' : 'bg-orange-50')}`}>
                        {/* Note: Background color logic is approximated from HTML examples, can be refined */}
                        <img src={avatar} className="w-full h-full object-cover" alt={name} />
                    </div>
                    {isAi && <div className="absolute -bottom-1 -right-1 ai-badge shadow-sm">AI</div>}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-gray-900">{name}</h3>
                            {/* Assuming all are verified for now, or add a prop */}
                            <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">咨询 {consultationCount}</span>
                            <span className="w-px h-3 bg-gray-200"></span>
                            <span className="text-orange-500 font-bold">案例 {caseCount}</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">{title}</p>

                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, index) => (
                            <span key={index} className={
                                tag.type === 'gold'
                                    ? "badge-gold px-2 py-0.5 rounded text-[10px] font-bold"
                                    : tag.type === 'pink'
                                        ? "bg-pink-50 text-pink-600 px-2 py-0.5 rounded text-[10px] border border-pink-100"
                                        : "bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px]"
                            }>
                                {tag.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {casePreview && caseStyle && (
                <div className={`case-preview-bar p-2.5 mb-3 flex items-center justify-between cursor-pointer transition-colors ${caseStyle.bar}`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${caseStyle.iconBg} ${caseStyle.iconColor}`}>
                            <i className={`${casePreview.icon} text-[10px]`}></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium">{casePreview.category}</span>
                            <span className="text-xs text-gray-700 font-bold truncate w-48">{casePreview.title}</span>
                        </div>
                    </div>
                    <i className={`fa-solid fa-chevron-right text-gray-300 text-xs ${caseStyle.hoverIcon}`}></i>
                </div>
            )}

            <button className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${buttonStyle === 'primary'
                ? 'bg-gray-900 text-white shadow-md hover:bg-black'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}>
                {buttonStyle === 'primary' ? (
                    <>
                        <span>访问个人主页</span>
                        <i className="fa-solid fa-arrow-right-long text-[10px]"></i>
                    </>
                ) : (
                    '访问个人主页'
                )}
            </button>
        </div>
    );
};

export default ExpertCard;
