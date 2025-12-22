export interface Product {
    id: number;
    product_name: string;
    product_code: string;
    product_type: string;
    company_name: string;
    description?: string;
    age_range?: string;
    insurance_period?: string;
    payment_period?: string;
    waiting_period?: string;
    cooling_off_period?: string;
    surrender_terms?: string;
    tags?: string;
    exclusions?: string;
    coverage?: string;
    extend_info?: Record<string, any>;
    status: number;
}

export interface ProductTypeResponse {
    product_types: string[];
}

const API_HOST = (import.meta.env.VITE_CRM_API_BASE_URL || '').trim().replace(/\/$/, '');
const API_BASE = API_HOST ? `${API_HOST}/api` : '/api'; // Note: Products match /api/products, while clients match /api/v1/clients

/**
 * 获取产品列表
 */
export const getProducts = async (productType?: string): Promise<Product[]> => {
    try {
        const params = new URLSearchParams();
        if (productType && productType !== '全部') {
            params.append('product_type', productType);
        }

        const response = await fetch(`${API_BASE}/products?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取产品列表失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ [Product API] 获取产品列表失败:', error);
        return [];
    }
};

/**
 * 获取所有产品类型 (分类)
 */
export const getProductTypes = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE}/product-types`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取产品类型失败: ${response.status}`);
        }

        const data: ProductTypeResponse = await response.json();
        return ['全部', ...data.product_types];
    } catch (error) {
        console.error('❌ [Product API] 获取产品类型失败:', error);
        return ['全部'];
    }
};

/**
 * 获取单个产品详情
 */
export const getProductDetail = async (id: number): Promise<Product | null> => {
    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`获取产品详情失败: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ [Product API] 获取产品详情失败:', error);
        return null;
    }
};
