const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, cancelOrder, updateOrderStatus, getAllOrders } = require('../controllers/orderController');

// POST /api/orders
router.post('/', createOrder);

// GET /api/orders (admin - all orders)
router.get('/', getAllOrders);

// GET /api/orders/:userId
router.get('/:userId', getUserOrders);

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id
router.delete('/:id', cancelOrder);

module.exports = router;
