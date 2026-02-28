const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables BEFORE doing anything else
dotenv.config();

const connectMongoDB = require('./config/mongoDb');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Basic Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON data

// Connect to MongoDB
connectMongoDB();

// Routes
app.use('/api', apiRoutes);

// A simple route to test if server is running
app.get('/', (req, res) => {
    res.send("Backend Server is running perfectly!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
