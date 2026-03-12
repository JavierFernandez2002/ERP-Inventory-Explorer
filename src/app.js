const express = require('express');
const path = require('path');
const productRoutes = require('./routes/products.routes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, "..",'public')));

// Routes
app.use('/api', productRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'public', 'index.html'));
});

module.exports = app;