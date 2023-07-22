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
// app.use(helmet());

// Setting headers
app.use((req, res, next) => { // Middleware to set required headers for allowing cross-origin requests and defining allowed methods and headers.
  res.setHeader('Access-Control-Allow-Origin', '*'); // This line sets the "Access-Control-Allow-Origin" header in the HTTP response to "". The "" value means that any origin is allowed to access the resources from your server. In a production environment, it's recommended to set this header to a specific domain to avoid potential security risks.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // This line sets the "Access-Control-Allow-Headers" header in the HTTP response. It specifies the list of allowed request headers that can be used when making cross-origin requests. In this case, various standard headers like "Origin," "X-Requested-With," "Content," "Accept," "Content-Type," and "Authorization" are allowed.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // This line sets the "Access-Control-Allow-Methods" header in the HTTP response. It specifies the list of allowed HTTP methods for cross-origin requests. In this case, the allowed methods are "GET," "POST," "PUT," "DELETE," "PATCH," and "OPTIONS.
  next(); // This line calls the next() function, which allows the request to continue to the next middleware in the chain. This is essential for proper handling of the request and response flow in the Express application.
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
app.use((err, req, res, next) => { // This line defines an error handling middleware function that takes four parameters: err (error), req (request), res (response), and next (next middleware function). This middleware will be triggered when an error occurs during the request-response cycle.
  console.error(err.stack); // This line logs the error stack trace to the console, providing more information about the error that occurred for debugging purposes.
  res.status(500).json({ error: 'Internal Server Error' }); // This line sends a JSON response with an error message "Internal Server Error" and sets the HTTP status code to 500 (Internal Server Error) to inform the client that an unexpected error occurred on the server.
  next(err); // Propagate the error to the next error handling middleware or the default error handler
});

// EXPORT
module.exports = app; // Exports the Express application