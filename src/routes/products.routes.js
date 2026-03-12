const express = require('express');
const { getProducts,
    getProductById,
    getStats
} = require('../controllers/products.controller');

const router = express.Router();

router.get('/products', getProducts);
router.get('/stats', getStats);
router.get('/products/:id', getProductById);

module.exports = router;