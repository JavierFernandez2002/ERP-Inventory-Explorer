const fs  = require('fs/promises');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../..', 'data', 'products.json');

// Service to get all products
async function getAllProducts() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products file:', error);
        throw new Error('Failed to read products data');
    }
}

module.exports = {
    getAllProducts,
};