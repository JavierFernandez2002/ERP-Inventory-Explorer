const {
    getAllProducts,
    getProductDetail,
    getInventoryStats,
} = require('../services/products.service');

//const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Controller to get all products
async function getProducts(req, res) {
    //await sleep(1000); // Simulate network delay
    try {
        const products = await getAllProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

async function getProductById(req, res) {
    //await sleep(500); // Simulate network delay
    try{
        const productId = Number(req.params.id);
        const product = await getProductDetail(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

async function getStats(req, res) {
    //await sleep(1000); // Simulate network delay
    try {
        const stats = await getInventoryStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        res.status(500).json({ error: 'Failed to fetch inventory stats' });
    }
}


module.exports = {
    getProducts,
    getProductById,
    getStats
};