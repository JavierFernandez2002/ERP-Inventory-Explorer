const fs  = require('fs/promises');
const path = require('path');
const {
    searchProducts,
    filterByCategory,
    filterByStock,
    sortProducts,
} = require('../utils/products.utils');
const { getCountryInfo } = require("./countries.service");

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
    const { search, category, inStock, sortBy, order, page=1, limit=6 } = query;
    let products = await readProductsFile();

    products = searchProducts(products, search);
    products = filterByCategory(products, category);
    products = filterByStock(products, inStock);
    products = sortProducts(products, sortBy, order);

    const currentPage = Number(page);
    const pageSize = Number(limit);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
        data: paginatedProducts,
        pagination: {
            page: currentPage,
            limit: pageSize,
            totalItems,
            totalPages
        }
    };
}

async function getProductDetail(id) {
    const products = await readProductsFile();
    const product = products.find(p => p.id === id);

    if (!product) {
        return null;
    }

    const country = await getCountryInfo(product.countryCode);

    return {
        ...product,
        country
    };
}

async function getInventoryStats(){
    const products = await readProductsFile();
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 5).length;
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalProducts > 0 ? (totalPrice / totalProducts).toFixed(2) : 0;

    return {
        totalProducts,
        lowStockProducts,
        totalPrice,
        averagePrice
    };
}

module.exports = {
    getAllProducts,
    getProductDetail,
    getInventoryStats
};