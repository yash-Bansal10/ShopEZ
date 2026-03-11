const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// GET /api/products
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post('/', addProduct);

// PUT /api/products/:id (admin)
router.put('/:id', updateProduct);

// DELETE /api/products/:id (admin)
router.delete('/:id', deleteProduct);

module.exports = router;
