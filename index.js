const express = require('express');
const { connectDB } = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');


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



// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
