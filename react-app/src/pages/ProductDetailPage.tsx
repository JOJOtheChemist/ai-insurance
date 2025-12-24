import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ProductHeader,
    TagsList,
    RulesGrid,
    CoverageList,
    ExclusionBox,
    BottomNav,
    DynamicTable,
    StructuredCoverage
} from '../components/ProductDetail';
import type {
    ProductData,
    MetricData
} from '../components/ProductDetail/ProductHeader'; // Import types directly from source

// Map extend_info.highlights to MetricData format
const mapHighlightsToMetrics = (highlights: any[]): MetricData[] => {
    return highlights.map(h => ({
        value: h.value,
        label: h.label
    }));
};

// Define optional env var for API base URL, fallback to localhost:8000
const API_BASE_URL = import.meta.env.VITE_CRM_API_BASE_URL || 'http://localhost:8000';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Custom back handler to return to product list tab
    const handleBack = () => {
        // If we came from a specific location (e.g. chat), go back there
        if (location.state?.from) {
            navigate(location.state.from);
            return;
        }

        // Default behavior: Navigate to the main page with state to active product list tab
        navigate('/', {
            state: { activeTab: '/product-list' },
            replace: true // Use replace to avoid building up history stack with back/forth
        });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.statusText}`);
                }
                const data = await response.json();

                // Transform Backend Data to Frontend ProductData (ProductHeader interface)
                // Backend: exclusions/tags/coverage might be strings (JSON or comma-separated)
                // Frontend: expects structured objects or arrays

                let parsedExtendInfo = data.extend_info || {};
                // If nested JSON strings exist, parse them here if needed, 
                // but pydantic/fastapi typically returns dict for 'extend_info' if defined as dict.

                // Parse Tags
                let parsedTags: string[] = [];
                if (data.tags) {
                    if (Array.isArray(data.tags)) {
                        parsedTags = data.tags;
                    } else if (typeof data.tags === 'string') {
                        // Attempt JSON parse or split by comma
                        try {
                            parsedTags = JSON.parse(data.tags);
                        } catch {
                            parsedTags = data.tags.split(',').map((t: string) => t.trim());
                        }
                    }
                }

                // Parse Exclusions
                let parsedExclusions: string[] = [];
                if (data.exclusions) {
                    if (Array.isArray(data.exclusions)) {
                        parsedExclusions = data.exclusions;
                    } else if (typeof data.exclusions === 'string') {
                        try {
                            parsedExclusions = JSON.parse(data.exclusions);
                            // Handle case where it parses to a single string? Unlikely if it's a list.
                            if (!Array.isArray(parsedExclusions)) parsedExclusions = [String(parsedExclusions)];
                        } catch {
                            // Fallback: split by newlines or semicolons if simple string
                            parsedExclusions = data.exclusions.split(/[\n;]/).map((t: string) => t.trim()).filter(Boolean);
                        }
                    }
                }

                // Coverage (Optional, if we want to fill coverage_list from main coverage field)
                // Note: The frontend uses extend_info.coverage_list or medical_features mostly.
                // We keep extend_info as is, assuming backend stores structural data there.

                const transformedProduct: ProductData = {
                    id: data.id,
                    product_name: data.product_name,
                    company_name: data.company_name,
                    product_type: data.product_type,
                    description: data.description || '',
                    age_range: data.age_range || '',
                    insurance_period: data.insurance_period || '',
                    waiting_period: data.waiting_period || '',
                    payment_period: data.payment_period || '',
                    tags: parsedTags,
                    exclusions: parsedExclusions,
                    extend_info: parsedExtendInfo
                    // metrics/coverage items will be derived from extend_info in the render part
                };

                setProduct(transformedProduct);
            } catch (err: any) {
                console.error('Failed to fetch product:', err);
                setError(err.message || '加载产品信息失败');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleConsultClick = () => {
        navigate('/chat', { state: { initialMessage: `请帮我介绍一下${product?.product_name}的详细信息` } });
    };

    const handleGenerateClick = () => {
        alert('开始为您生成个性化计划书...');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-2 font-medium">出错了</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">产品未找到</p>
            </div>
        );
    }

    // Prepare data for components
    const metrics = product.extend_info?.highlights
        ? mapHighlightsToMetrics(product.extend_info.highlights)
        : [];

    // Transform coverage data to match CoverageItem interface (if needed by CoverageList)
    // Or rendering custom list inside ExpandableSection
    const coverageItems = (product.extend_info?.coverage_list || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.desc,
        amount: item.value || '含'
    }));

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <ProductHeader
                product={product}
                metrics={metrics}
                onBack={handleBack}
                badge="Premium 严选"
            />

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 -mt-5 relative z-10 space-y-6">
                {/* Tags */}
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <TagsList tags={product.tags || []} />
                </div>

                {/* Rules & Coverage (Structured) */}
                {product.extend_info?.medical_features ? (
                    <StructuredCoverage
                        type="medical"
                        features={product.extend_info.medical_features}
                    />
                ) : product.extend_info?.illness_features ? (
                    <StructuredCoverage
                        type="illness"
                        features={product.extend_info.illness_features}
                    />
                ) : product.extend_info?.accident_features ? (
                    <StructuredCoverage
                        type="accident"
                        features={product.extend_info.accident_features}
                    />
                ) : product.extend_info?.life_features ? (
                    <StructuredCoverage
                        type="life"
                        features={product.extend_info.life_features}
                    />
                ) : product.extend_info?.pension_features ? (
                    <StructuredCoverage
                        type="pension"
                        features={product.extend_info.pension_features}
                    />
                ) : (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-bold flex items-center text-gray-900 mb-4">
                            <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                            投保规则
                        </h3>
                        <RulesGrid
                            ageRange={product.age_range}
                            insurancePeriod={product.insurance_period}
                            waitingPeriod={product.waiting_period}
                            paymentMethod={product.payment_period}
                        />
                    </div>
                )}

                {/* Coverage (Fallback if no structured features) */}
                {/* Note: If structured features are present, they are rendered above. We only show CoverageList if NONE are present. */}
                {!product.extend_info?.medical_features &&
                    !product.extend_info?.illness_features &&
                    !product.extend_info?.accident_features &&
                    !product.extend_info?.life_features &&
                    !product.extend_info?.pension_features && (
                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold flex items-center text-gray-900 mb-4">
                                <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                                核心保障权益
                            </h3>
                            <CoverageList items={coverageItems} />
                        </div>
                    )}

                {/* Rates / Dynamic Table */}
                {product.extend_info?.table_data && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-bold flex items-center text-gray-900 mb-4">
                            <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                            {product.extend_info.table_data.title || '数据参考'}
                        </h3>
                        <DynamicTable
                            data={product.extend_info.table_data}
                            showTitle={false}
                        />
                    </div>
                )}

                {/* Exclusions */}
                {product.exclusions && product.exclusions.length > 0 && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-bold flex items-center text-gray-900 mb-4">
                            <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                            重要提示 & 责任免除
                        </h3>
                        <ExclusionBox exclusions={product.exclusions} />
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav
                onConsultClick={handleConsultClick}
                onGenerateClick={handleGenerateClick}
            />
        </div>
    );
};

export default ProductDetailPage;
