// IMPORTS
const express = require('express');
const router = express.Router();
const checkEmail = require('../middleware/email_validator'); // Import the email validator middleware for validating email inputs
const checkPassword = require('../middleware/password_validator'); // Import the password validator middleware for validating password inputs
const limit = require('../middleware/limiter');  // Import the limiter middleware for request rate limiting
const userCtrl = require('../controllers/user'); // Import the user controller for handling user-related operations

// ROUTES
router.post('/signup', checkEmail, checkPassword, userCtrl.signup); // Route for user signup with email and password validation
router.post('/login', limit.max, userCtrl.login); // Route for user login with request rate limiting

// EXPORT
module.exports = router;