// This file configures the Express application by setting up middleware, route definitions, and error handling.
// It handles securing HTTP headers, parsing JSON objects, preventing code injection in MongoDB, serving image files, and mounting routes.
// It works in tandem with server.js to create a fully functional backend server for the application. It is common to refer to these combined files as the "index.js" of the backend app.

// IMPORTS
const express = require('express'); // Imports the Express framework
// const helmet = require('helmet'); // Imports the helmet middleware for securing HTTP headers
const path = require('path'); // Imports the path module for working with file and directory paths
const mongoSanitize = require('express-mongo-sanitize'); // Imports the mongoSanitize middleware for preventing NoSQL injection attacks
const sauceRoutes = require('./routes/sauce'); // Imports the sauce routes module
const userRoutes = require('./routes/user'); // Imports the user routes module
const app = express(); // Creates an instance of the Express application


// EXPRESS SERVER FUNCTIONALITIES

// Securing HTTP headers
// app.use(helmet()); // Helmet sets security-related response headers to enhance the overall security of your Express application, including Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, X-Dns-Prefetch-Control, X-Download-Options, X-Frame-Options, Referrer-Policy, Cross-Origin-Opener-Policy, and Cross-Origin-Resource-Policy.

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
app.use(mongoSanitize()); // Apply the 'mongoSanitize' middleware to sanitize user-supplied data in request parameters, headers, and body. This helps prevent NoSQL injection attacks by stripping malicious MongoDB operators from the data.

// Handling image files
app.use('/images', express.static(path.join(__dirname, 'images'))); // Set up a static path in your application to serve images from the 'images' folder, making them accessible to the front-end; considered best practice when defining static paths in your app, using "__dirname" refers to the current directory path where the script resides, and it helps create an absolute path to the 'images' folder; "/images" is the URL path that the front-end will use to access the images.

// Routes
app.use('/api/sauces', sauceRoutes); // Mount the 'sauceRoutes' middleware at the '/api/sauces' URL path, allowing access to the backend API endpoints related to sauces. This makes it possible for the front-end to interact with the server and perform CRUD operations (Create, Read, Update, Delete) on sauces data.

app.use('/api/auth', userRoutes); // Mount the 'userRoutes' middleware at the '/api/auth' URL path, enabling the front-end to interact with the authentication-related API endpoints on the server. This allows users to register, log in, and manage their authentication sessions.

// Error handling middleware
app.use((err, req, res, next) => { // This line defines an error handling middleware function that takes four parameters: err (error), req (request), res (response), and next (next middleware function). This middleware will be triggered when an error occurs during the request-response cycle.
  console.error(err.stack); // This line logs the error stack trace to the console, providing more information about the error that occurred for debugging purposes.
  res.status(500).json({ error: 'Internal Server Error' }); // This line sends a JSON response with an error message "Internal Server Error" and sets the HTTP status code to 500 (Internal Server Error) to inform the client that an unexpected error occurred on the server.
  next(err); // Propagate the error to the next error handling middleware or the default error handler
});

// EXPORT
module.exports = app; // Exports the Express application