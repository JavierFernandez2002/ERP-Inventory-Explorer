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

async function getProductById(req, res) {
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


module.exports = {
    getProducts,
    getProductById,
};