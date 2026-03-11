const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');

// Initialize App
const app = express();
const port = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('ShopEZ Backend API is running!');
});

// Import API Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
