import React, { useState, useEffect } from 'react';
import ProductHeader from './ProductHeader';
import ProductCard from './ProductCard';
import CompareDock from './CompareDock';
import CustomerSelectDrawer from './CustomerSelectDrawer';
import { getProducts, getProductTypes } from '../../services/productApi';
import type { Product } from '../../services/productApi';

interface InsuranceProductListProps {
    onAiChat?: (message: string) => void;
}

const InsuranceProductList: React.FC<InsuranceProductListProps> = ({ onAiChat }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['全部']);
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [selectedCompany, setSelectedCompany] = useState('全部');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const types = await getProductTypes();
            setCategories(types);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts(selectedCategory);
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [selectedCategory]);

    // Compute unique companies from the products list
    const availableCompanies = React.useMemo(() => {
        const companies = new Set<string>();
        companies.add('全部');
        products.forEach(p => {
            if (p.company_name) {
                // Simplified company name for the filter pill (e.g. '平安人寿' -> '平安')
                const shortName = p.company_name.replace(/(人寿|保险|意健险|养老)/g, '');
                companies.add(shortName);
            }
        });
        return Array.from(companies);
    }, [products]);

    const handleCompareToggle = (id: number, checked: boolean) => {
        setSelectedProducts(prev => {
            const next = new Set(prev);
            if (checked) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    };

    const filteredProducts = products.filter(product => {
        const matchesCompany = selectedCompany === '全部' || product.company_name.includes(selectedCompany);
        const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.tags && product.tags.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCompany && matchesSearch;
    });

    const handleAiAnalysis = (product: Product) => {
        const message = `请分析一下 ${product.company_name} 的 ${product.product_name} 有哪些核心卖点？`;
        if (onAiChat) {
            onAiChat(message);
        }
    };

    const handleAiCompare = () => {
        // 根据 selectedProducts (Set<number>) 获取完整产品信息
        const selectedProductList = products.filter(p => selectedProducts.has(p.id));

        if (selectedProductList.length < 2) {
            alert('请至少选择2款产品进行对比');
            return;
        }

        // 构造产品名称列表
        const productNames = selectedProductList.map(p =>
            `${p.company_name}的${p.product_name}`
        ).join('、');

        const message = `请帮我对比分析以下保险产品：${productNames}。从保障范围、保费价格、核保条件、增值服务等维度进行详细对比分析。`;
        if (onAiChat) {
            onAiChat(message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden font-sans">
            <ProductHeader
                categories={categories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                companies={availableCompanies}
                activeCompany={selectedCompany}
                onCompanyChange={setSelectedCompany}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-32 no-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm font-medium">加载优质保险产品...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isSelected={selectedProducts.has(product.id)}
                            onCompareToggle={handleCompareToggle}
                            onMakeProposal={() => setIsDrawerOpen(true)}
                            onAiAnalysis={() => handleAiAnalysis(product)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                            <i className="fa-solid fa-box-open text-2xl"></i>
                        </div>
                        <p className="text-gray-900 font-bold mb-1">未找到匹配产品</p>
                        <p className="text-gray-400 text-xs">尝试更换分类或调整搜索关键词</p>
                    </div>
                )}

                {/* Helper for bottom spacing and safe areas */}
                <div className="h-10 shrink-0" />
            </main>

            <CompareDock
                active={selectedProducts.size > 0}
                selectedCount={selectedProducts.size}
                onAiCompare={handleAiCompare}
            />

            <CustomerSelectDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onConfirm={() => {
                    setIsDrawerOpen(false);
                }}
            />
        </div>
    );
};

export default InsuranceProductList;
