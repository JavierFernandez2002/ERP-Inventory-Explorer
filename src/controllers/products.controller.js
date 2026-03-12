const {
    getAllProducts,
    getProductDetail,
    getInventoryStats,
} = require('../services/products.service');

// Controller to get all products
async function getProducts(req, res) {
    try {
        const products = await getAllProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}


module.exports = {
    getProducts,
};