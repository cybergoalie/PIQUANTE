// IMPORTS
const express = require('express'); // Imports the Express framework
const helmet = require('helmet'); // Imports the helmet middleware for securing HTTP headers
const path = require('path'); // Imports the path module for working with file and directory paths
const mongoSanitize = require('express-mongo-sanitize'); // Imports the mongoSanitize middleware for preventing NoSQL injection attacks
const sauceRoutes = require('./routes/sauce'); // Imports the sauce routes module
const userRoutes = require('./routes/user'); // Imports the user routes module
const app = express(); // Creates an instance of the Express application


// EXPRESS SERVER FUNCTIONALITIES

// Securing HTTP headers
app.use(helmet());

// Setting headers
app.use((req, res, next) => { // Middleware to set required headers for allowing cross-origin requests and defining allowed methods and headers.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Parsing JSON objects
app.use(express.json()); // Middleware for parsing incoming JSON objects in requests

// Preventing code injection in MongoDB
app.use(mongoSanitize()); // Middleware to sanitize user-supplied data and prevent NoSQL injection attacks.

// Handling image files
app.use('/images', express.static(path.join(__dirname, 'images'))); // Middleware to serve static files from the 'images' directory.

// Routes
app.use('/api/sauces', sauceRoutes); // Middleware for handling sauce routes
app.use('/api/auth', userRoutes); // Middleware for handling user routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// EXPORT
module.exports = app; // Exports the Express application