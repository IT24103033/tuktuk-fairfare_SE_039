require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware to handle cross-origin requests and JSON data
app.use(cors());
app.use(express.json());

// A simple root route to verify the server is up
app.get('/', (req, res) => {
    res.send('TukTuk FairFare API is running');
});

// Import and use your custom API routes (from Section 2)
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Use environment port for Render/Railway deployment, fallback to 5000 locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});