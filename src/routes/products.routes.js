const express = require('express');
const { getProducts,
    getProductById,
} = require('../controllers/products.controller');

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);

module.exports = router;