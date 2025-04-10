const express = require('express');
const app = express();
const investmentRoutes = require('./routes/investmentRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/investments', investmentRoutes);

module.exports = app;