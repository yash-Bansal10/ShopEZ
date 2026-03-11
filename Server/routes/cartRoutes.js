const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

// GET /api/cart/:userId
router.get('/:userId', getCart);

// POST /api/cart
router.post('/', addToCart);

// DELETE /api/cart/:id
router.delete('/:id', removeFromCart);

module.exports = router;
