const { Cart } = require('../models/Schema');

// Get cart items for a specific user
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItems = await Cart.find({ userId });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, title, description, mainImg, size, quantity, price, discount } = req.body;
        
        // Check if this user already has this exact item and size in their cart
        let existingItem = await Cart.findOne({ userId, title, size });
        
        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json({ message: 'Item quantity updated in cart', item: existingItem });
        }

        const newCartItem = new Cart({
            userId,
            title,
            description,
            mainImg,
            size,
            quantity,
            price,
            discount
        });

        await newCartItem.save();
        res.status(201).json({ message: 'Item added to cart successfully', item: newCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.findByIdAndDelete(id);
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};
