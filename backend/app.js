require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const auth=require('./routes/auth');
const softwareRoutes = require('./routes/software');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth',auth);

////Api and software routes
app.use('/api/software', softwareRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
