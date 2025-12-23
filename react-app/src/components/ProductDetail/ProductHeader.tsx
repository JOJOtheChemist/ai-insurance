import React from 'react';

export interface ProductData {
    id?: number;
    product_name: string;
    company_name: string;
    product_type?: string;
    description?: string;
    age_range?: string;
    insurance_period?: string;
    waiting_period?: string;
    payment_period?: string;
    tags?: string[];
    coverage?: CoverageItem[];
    exclusions?: string[];
    extend_info?: {
        medical_features?: Record<string, any>;
        illness_features?: Record<string, any>;
        accident_features?: Record<string, any>;
        life_features?: Record<string, any>;
        pension_features?: Record<string, any>;
        table_data?: {
            title?: string;
            headers: string[];
            rows: string[][];
        };
        [key: string]: any;
    };
}

export interface CoverageItem {
    icon: string;
    title: string;
    description: string;
    amount: string;
}

export interface MetricData {
    value: string;
    unit?: string;
    label: string;
}

interface ProductHeaderProps {
    product: ProductData;
    metrics?: MetricData[];
    badge?: string;
    onBack?: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product, metrics = [], badge = 'TOP 推荐', onBack }) => {
    return (
        <header className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-6 left-4 z-20">
                <button
                    onClick={onBack || (() => window.history.back())}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                </button>
            </div>

            {/* Decorative gradient circle */}
            <div
                className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(198,156,109,0.2) 0%, rgba(0,0,0,0) 70%)'
                }}
            />

            {/* Badge */}
            <div className="mt-6">
                {badge && (
                    <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3 uppercase shadow-sm">
                        {badge}
                    </span>
                )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                {product.product_name}
            </h1>

            {/* Company */}
            <div className="text-sm opacity-80 mb-4 flex items-center">
                <i className="fa-solid fa-shield-halved mr-1.5 text-orange-400"></i>
                {product.company_name}
            </div>

            {/* Description */}
            {product.description && (
                <p className="text-sm text-white/80 max-w-xl">
                    {product.description}
                </p>
            )}

            {/* Metrics */}
            {metrics.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="flex-1 min-w-[120px] bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10"
                        >
                            <div className="text-xl font-bold text-amber-400">
                                {metric.value}
                                {metric.unit && <span className="text-sm ml-0.5">{metric.unit}</span>}
                            </div>
                            <div className="text-xs text-white/60 mt-1">{metric.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default ProductHeader;
