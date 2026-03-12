const fs  = require('fs/promises');
const path = require('path');
const {
    searchProducts,
    filterByCategory,
    filterByStock,
    sortProducts,
} = require('../utils/products.utils');

const PRODUCTS_FILE = path.join(__dirname, '../..', 'data', 'products.json');

async function readProductsFile() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products file:', error);
        throw new Error('Could not read products data');
    }
}


async function getAllProducts(query = {}) {
    const { search, category, inStock, sortBy, order } = query;
    let products = await readProductsFile();

    products = searchProducts(products, search);
    products = filterByCategory(products, category);
    products = filterByStock(products, inStock);
    products = sortProducts(products, sortBy, order);

    return products;
}

async function getProductDetail(id) {
    const products = await readProductsFile();
    return products.find(product => product.id === parseInt(id)) || null;
}

module.exports = {
    getAllProducts,
    getProductDetail,
    readProductsFile
};