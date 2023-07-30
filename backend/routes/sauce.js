// CREATE SAUCE ROUTES: define the endpoints and associated handlers for handling incoming HTTP requests
// IMPORTS
const express = require('express'); // Imports the Express framework for building web applications.
const router = express.Router(); // Creates a router object from the Express framework, which allows defining routes for the application.
const sauceCtrl = require('../controllers/sauce'); // Imports the sauce controller module, which contains the logic for handling sauce-related operations.

const auth = require('../middleware/auth'); // Middleware for authenticating and authorizing users based on valid tokens, ensuring only authenticated users can access protected routes.
const logger = require('../middleware/logger'); // Middleware for logging incoming requests and capturing request details like method, URL, and timestamp.
const multer = require('../middleware/multer'); // Middleware for handling file uploads, allowing processing and storage of uploaded files as part of the request payload.

// ROUTES
router.get('/', auth, logger, sauceCtrl.getAllSauces); // Sets up a route for handling a GET request to the root URL ('/'), using auth middleware for authentication, logger middleware for logging the incoming request, and sauceCtrl.getAllSauces function as the route handler to fetch and return all sauces.
router.post('/', auth, multer, sauceCtrl.createSauce); // Sets up a route for handling a POST request to the root URL ('/'), using auth middleware for authentication, skips the logger middleware so sensitive data that might be sent in the request body is not logged, and the sauceCtrl.createSauce function as the route handler to handle the "create" action for a new sauce.
router.get('/:id', auth, logger, sauceCtrl.getOneSauce); // Sets up a route for handling a GET request to an endpoint with a specific id parameter, using auth middleware for authentication, logger middleware for logging the incoming request, and sauceCtrl.getOneSauce function as the route handler to fetch and return a specific sauce.
router.put('/:id', auth, logger, multer, sauceCtrl.modifySauce); // Sets up a route for handling a PUT request to an endpoint with a specific id parameter for modifying a sauce, using auth middleware for authentication, logger middleware for logging the incoming request, multer middleware for handling file uploads, and sauceCtrl.modifySauce function as the route handler to modify a specific sauce.
router.post('/:id/like', auth, logger, sauceCtrl.likeSauce); // Sets up a route for handling a POST request to an endpoint with a specific id parameter for liking a sauce, using auth middleware for authentication, logger middleware for logging the incoming request, and sauceCtrl.likeSauce function as the route handler to handle the "like" action for a specific sauce.
router.delete('/:id', auth, logger, sauceCtrl.deleteSauce); // Sets up a route for handling a DELETE request to an endpoint with a specific id parameter, using auth middleware for authentication, logger middleware for logging the incoming request, and sauceCtrl.deleteSauce function as the route handler to delete a specific sauce.

// EXPORT
module.exports = router; // The final statement in the code, the module.exports object is a special object that is used to expose functions, variables, or objects from a module to other parts of the application. When a module is imported in another file using require, the exported object becomes accessible in that file, allowing you to use the functionalities defined in the module. In this case, by exporting the router object, you make all the defined routes (router.get, router.post, etc.) and their associated middleware functions available to other parts of the application. In the main application file, app.js, we import this router module using require and then use it as middleware by attaching it to the Express application.
