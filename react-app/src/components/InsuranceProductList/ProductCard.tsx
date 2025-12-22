import React from 'react';

import type { Product } from '../../services/productApi';

interface Metric {
    label: string;
    value: string;
    isHighlighted?: boolean;
}

interface ProductCardProps {
    product: Product;
    onCompareToggle: (id: number, checked: boolean) => void;
    onMakeProposal: () => void;
    onAiAnalysis: () => void;
    isSelected?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onCompareToggle,
    onMakeProposal,
    onAiAnalysis,
    isSelected
}) => {

    // Map company to color and initial
    const getCompanyInfo = (companyName: string) => {
        if (companyName.includes('平安')) return { color: 'bg-orange-500', initial: '平' };
        if (companyName.includes('友邦')) return { color: 'bg-blue-600', initial: '友' };
        if (companyName.includes('MSH') || companyName.includes('万欣和')) return { color: 'bg-cyan-600', initial: 'M' };
        if (companyName.includes('人保')) return { color: 'bg-red-600', initial: '人' };
        if (companyName.includes('泰康')) return { color: 'bg-teal-600', initial: '泰' };
        return { color: 'bg-gray-400', initial: companyName[0] };
    };

    const companyInfo = getCompanyInfo(product.company_name);

    // Parse tags: backend returns string, frontend needs array
    // Parse tags: backend might return a JSON string of an array or a comma-separated string
    const getTags = (tagsStr?: string): string[] => {
        if (!tagsStr) return [];
        if (tagsStr.trim().startsWith('[') && tagsStr.trim().endsWith(']')) {
            try {
                const parsed = JSON.parse(tagsStr);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                // Ignore parse error and fallback to split
            }
        }
        return tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    };

    const tags = getTags(product.tags);

    // Dynamically generate metrics from extend_info.highlights or fallback to basic fields
    const metrics: Metric[] = [];

    // Helper: Check if a value is meaningful and concise
    const isValueMeaningful = (value: string): boolean => {
        if (!value || value.length < 2) return false;
        // Filter out vague or truncated values
        const lowQualityPatterns = ['详见条款', '详见', '...', '待定', '未知', '暂无', '请咨询'];
        if (lowQualityPatterns.some(pattern => value.includes(pattern))) return false;
        // Skip overly long values (more than 25 characters is too long for a metric card)
        if (value.length > 25) return false;
        return true;
    };

    // Helper: Smartly shorten a value if it's too long
    const shortenValue = (value: string, maxLength: number = 20): string => {
        if (value.length <= maxLength) return value;

        // Try to extract key number ranges
        const rangeMatch = value.match(/(\d+[-~至]\d+)/);
        if (rangeMatch) return rangeMatch[1];

        // Try to extract age ranges
        const ageMatch = value.match(/(\d+)[-~至](\d+)[周岁岁]/);
        if (ageMatch) return `${ageMatch[1]}-${ageMatch[2]}岁`;

        // Fallback: just truncate
        return value.substring(0, maxLength) + '...';
    };

    // Priority 1: Use highlights from extend_info if available, but filter quality
    if (product.extend_info?.highlights && Array.isArray(product.extend_info.highlights)) {
        product.extend_info.highlights.forEach((highlight: any, index: number) => {
            if (metrics.length < 3 && highlight.label && highlight.value && isValueMeaningful(highlight.value)) {
                metrics.push({
                    label: highlight.label,
                    value: highlight.value,
                    isHighlighted: index === 0 && metrics.length === 0
                });
            }
        });
    }

    // Priority 2: Extract from medical_features for medical insurance
    if (metrics.length < 3 && product.extend_info?.medical_features) {
        const features = product.extend_info.medical_features;

        // Age limit
        if (metrics.length < 3 && features.basic_rules?.age_limit) {
            metrics.push({ label: '投保年龄', value: features.basic_rules.age_limit });
        }

        // Waiting period highlight (no waiting is a selling point)
        if (metrics.length < 3 && features.basic_rules?.waiting_period === '无') {
            metrics.push({ label: '等待期', value: '✓ 无等待期', isHighlighted: true });
        }

        // Critical illness allowance
        if (metrics.length < 3 && features.hospitalization?.critical_illness_allowance) {
            const allowance = features.hospitalization.critical_illness_allowance;
            if (!allowance.includes('...') && allowance.length < 20) {
                metrics.push({ label: '重疾津贴', value: allowance });
            }
        }
    }

    // Priority 3: Extract from coverage_list highlights
    if (metrics.length < 3 && product.extend_info?.coverage_list && Array.isArray(product.extend_info.coverage_list)) {
        const coverageHighlights = product.extend_info.coverage_list
            .filter((item: any) => item.value === '✅' || item.value === '✓')
            .slice(0, 2);

        coverageHighlights.forEach((item: any) => {
            if (metrics.length < 3 && item.title && item.title.length < 15) {
                // Use short, punchy coverage titles
                const shortTitle = item.title.replace(/可选部分-|基本部分-/g, '');
                metrics.push({ label: '保障', value: shortTitle });
            }
        });
    }

    // Priority 4: If still no quality metrics, fall back to product type-specific fields
    // Apply smart shortening for potentially long values
    if (metrics.length < 3) {
        if (product.product_type === '重疾险') {
            if (metrics.length < 3 && product.waiting_period && isValueMeaningful(product.waiting_period)) {
                metrics.push({ label: '等待期', value: product.waiting_period });
            }
            if (metrics.length < 3 && product.insurance_period) {
                const shortened = shortenValue(product.insurance_period, 15);
                if (isValueMeaningful(shortened)) {
                    metrics.push({ label: '保障期限', value: shortened });
                }
            }
        } else if (product.product_type === '医疗险' || product.product_type === '百万医疗') {
            if (metrics.length < 3) metrics.push({ label: '保障范围', value: '住院+门急诊', isHighlighted: true });
            if (metrics.length < 3 && product.waiting_period && isValueMeaningful(product.waiting_period)) {
                metrics.push({ label: '等待期', value: product.waiting_period });
            }
        } else if (product.product_type?.includes('意外')) {
            if (metrics.length < 3 && product.age_range) {
                const shortened = shortenValue(product.age_range, 15);
                if (isValueMeaningful(shortened)) {
                    metrics.push({ label: '投保年龄', value: shortened });
                }
            }
            if (metrics.length < 3) metrics.push({ label: '伤残保障', value: '1-10级', isHighlighted: true });
        } else {
            // Generic insurance products
            if (metrics.length < 3 && product.age_range) {
                const shortened = shortenValue(product.age_range, 15);
                if (isValueMeaningful(shortened)) {
                    metrics.push({ label: '投保年龄', value: shortened });
                }
            }
            if (metrics.length < 3 && product.insurance_period) {
                const shortened = shortenValue(product.insurance_period, 15);
                if (isValueMeaningful(shortened)) {
                    metrics.push({ label: '保障期限', value: shortened });
                }
            }
        }

        // Add payment period if we still need more metrics
        if (metrics.length < 3 && product.payment_period && isValueMeaningful(product.payment_period)) {
            metrics.push({ label: '缴费期', value: product.payment_period });
        }
    }

    return (
        <div className="product-card bg-white rounded-[20px] p-4 relative overflow-hidden transition-all duration-100 active:scale-[0.99] border-2 border-transparent hover:border-orange-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {/* Top Section: Company Info & Badge */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${companyInfo.color}`}>
                        {companyInfo.initial}
                    </div>
                    <span className="text-xs font-bold text-gray-500">{product.company_name}</span>
                </div>
                {product.status === 2 && (
                    <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                        热销
                    </span>
                )}
            </div>

            {/* Main Info: Title & Tags */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-1">
                    {product.product_name}
                </h3>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${idx === 0
                                    ? 'text-orange-600 bg-orange-50 border-orange-100'
                                    : 'text-gray-500 bg-gray-100 border-transparent'
                                    }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Metrics Section: Grid logic to stretch */}
            {metrics.length > 0 && (
                <div className={`grid gap-2 mb-3 ${metrics.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-[#F9FAFB] rounded-lg p-2 flex flex-col justify-center min-h-[56px]">
                            <div className="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                {metric.label}
                            </div>
                            <div className={`text-base leading-tight ${metric.isHighlighted ? 'font-black text-orange-600' : 'font-bold text-gray-800'}`}>
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Bar: Comparison, AI Analysis & Proposal */}
            <div className="border-t border-[#F3F4F6] mt-3 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none shrink-0">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onCompareToggle(product.id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                        />
                        加入对比
                    </label>

                    <div className="flex flex-1 gap-2">
                        <button
                            onClick={onAiAnalysis}
                            className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-xs"></i> AI 卖点
                        </button>
                        <button
                            onClick={onMakeProposal}
                            className="flex-1 bg-gray-900 text-white py-2.5 rounded-full text-[11px] font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                        >
                            <i className="fa-solid fa-file-signature text-xs"></i> 制作计划书
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
