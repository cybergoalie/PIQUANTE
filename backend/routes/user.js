// IMPORTS
const express = require('express');
const router = express.Router();
const checkEmail = require('../middleware/email_validator');
const checkPassword = require('../middleware/pswd_validator');
const limit = require('../middleware/limiter');
const userCtrl = require('../controllers/user');

// ROUTES
router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', limit.max, userCtrl.login);

// EXPORT
module.exports = router;