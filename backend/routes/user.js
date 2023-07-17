// Routes are the "Navigation Directors". They define the available endpoints or URLs that clients can access to interact with the application. Routes handle the incoming requests from clients and direct them to the appropriate controllers based on the requested URL and HTTP method.
// CREATE USER ROUTE: define the endpoints and associated handlers for handling incoming HTTP requests
// IMPORTS
const express = require('express'); // Imports the Express framework for building web applications.
const router = express.Router(); // Creates a router object from the Express framework, which allows defining routes for the application.
const userCtrl = require('../controllers/user'); // Import the user controller for handling user-related operations

const checkEmail = require('../middleware/email_validator'); // Import the email validator middleware for validating email inputs
const checkPassword = require('../middleware/password_validator'); // Import the password validator middleware for validating password inputs
const limit = require('../middleware/limiter');  // Import the limiter middleware for request rate limiting

// ROUTES
router.post('/signup', checkEmail, checkPassword, userCtrl.signup); // Route for user signup with email and password validation
router.post('/login', limit.max, userCtrl.login); // Route for user login with request rate limiting

// EXPORT
module.exports = router;