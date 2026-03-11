const { Orders } = require('../models/Schema');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        
        // Add current date if not provided
        if (!orderData.orderDate) {
            orderData.orderDate = new Date().toISOString();
        }

        const newOrder = new Orders(orderData);
        await newOrder.save();
        
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get orders for a specific user
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const userOrders = await Orders.find({ userId }).sort({ _id: -1 }); // newest first
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel an order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Orders.findByIdAndDelete(id);
        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const updated = await Orders.findByIdAndUpdate(id, { orderStatus }, { new: true });
        res.status(200).json({ message: 'Order status updated', order: updated });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get ALL orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Orders.find({}).sort({ _id: -1 });
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
};
