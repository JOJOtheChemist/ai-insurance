import React, { useState } from 'react';
import ProductHeader from './ProductHeader';
import ProductCard from './ProductCard';
import CompareDock from './CompareDock';
import CustomerSelectDrawer from './CustomerSelectDrawer';

const InsuranceProductList: React.FC = () => {
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const products = [
        {
            id: 1,
            company: '平安人寿',
            name: '御享金瑞 · 增额终身寿',
            companyInitial: '平',
            companyColor: 'bg-orange-500',
            badge: '本周热销',
            tags: ['现价增长快', '减保灵活'],
            metrics: [
                { label: '长期 IRR 可达', value: '2.98%', isHighlighted: true },
                { label: '回本周期', value: '5-7年' }
            ]
        },
        {
            id: 2,
            company: '友邦保险',
            name: '友如意 · 顺心版 (2025)',
            companyInitial: '友',
            companyColor: 'bg-blue-600',
            badge: '绿通服务',
            tags: ['癌症二次赔', 'ICU 津贴'],
            metrics: [
                { label: '重疾种类', value: '120种' },
                { label: '最高保额', value: '100万' }
            ]
        },
        {
            id: 3,
            company: 'MSH 万欣和',
            name: '精选 · 全球高端医疗',
            companyInitial: 'M',
            companyColor: 'bg-cyan-600',
            tags: ['包含私立医院', '0免赔'],
            metrics: [
                { label: '全球直付', value: '支持', isHighlighted: true },
                { label: '年度限额', value: '2000万' },
                { label: '医疗资源', value: '全球' }
            ]
        }
    ];

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

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden font-sans">
            <ProductHeader />

            <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-32 no-scrollbar">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        isSelected={selectedProducts.has(product.id)}
                        onCompareToggle={(checked) => handleCompareToggle(product.id, checked)}
                        onMakeProposal={() => setIsDrawerOpen(true)}
                    />
                ))}

                {/* Helper for bottom spacing and safe areas */}
                <div className="h-10 shrink-0" />
            </main>

            <CompareDock
                active={selectedProducts.size > 0}
                selectedCount={selectedProducts.size}
            />

            <CustomerSelectDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onConfirm={() => {
                    setIsDrawerOpen(false);
                    // Potential integration point for generating proposal
                }}
            />
        </div>
    );
};

export default InsuranceProductList;
