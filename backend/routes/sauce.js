// CREATE SAUCE ROUTES: define the endpoints and associated handlers for handling incoming HTTP requests
// IMPORTS
const express = require('express'); // Imports the Express framework for building web applications.
const router = express.Router(); // Creates a router object from the Express framework, which allows defining routes for the application.
const sauceCtrl = require('../controllers/sauce'); // Imports the sauce controller module, which contains the logic for handling sauce-related operations.

const auth = require('../middleware/auth'); // once the user is authenticated and has a valid token, subsequent routes that require authentication, such as accessing user-specific resources or updating user information, might benefit from using the auth.js middleware. This ensures that only authenticated users can access those routes.
const logger = require('../middleware/logger'); // Middleware for logging incoming requests and capturing request details like method, URL, and timestamp.
const multer = require('../middleware/multer'); // Middleware for handling file uploads, allowing processing and storage of uploaded files as part of the request payload.

// ROUTES
router.get('/', auth, logger, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, logger, sauceCtrl.getOneSauce);
router.put('/:id', auth, logger, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, logger, sauceCtrl.likeSauce);
router.delete('/:id', auth, logger, sauceCtrl.deleteSauce);

// EXPORT
module.exports = router;
