const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const setupSwagger = require('./config/swagger'); // Add this import

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const itemRoutes = require('./routes/itemRoutes');
const productRoutes = require('./routes/productRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));


// Setup Swagger UI
setupSwagger(app); // Add Swagger setup here

// Auth Routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/users', userRoutes);

// Booking routes
app.use('/api', bookingRoutes);

// Item routes
app.use('/api/items', itemRoutes);

// Product routes
app.use('/api/products', productRoutes);
// Shoppings routes
app.use('/api/shoppings', shoppingRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
