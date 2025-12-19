
import products from './src/data/products_illness.js';
console.log('Successfully imported products. Count:', products.length);
console.log('Product 34:', JSON.stringify(products.find(p => p.id === 34)?.extend_info?.illness_features, null, 2));
console.log('Product 27 disease_list length:', products.find(p => p.id === 27)?.extend_info?.illness_features?.heavy_illness?.disease_list?.length);
