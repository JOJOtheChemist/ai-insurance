import lifeProducts from './products_life.js';
import pensionProducts from './products_pension.js';
import illnessProducts from './products_illness.js';
import medicalProducts from './products_medical.js';
import accidentProducts from './products_accident.js';

const allProducts = [
  ...lifeProducts,
  ...pensionProducts,
  ...illnessProducts,
  ...medicalProducts,
  ...accidentProducts
];

// Re-sort by ID to maintain original order if needed, or just export combined
allProducts.sort((a, b) => a.id - b.id);

export default allProducts;
