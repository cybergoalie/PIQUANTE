// IMPORT
const checkEmail = require('email-validator');

// EXPORT
module.exports = (req, res, next) => {
    if (!checkEmail.validate(req.body.email)) {
        return res.status(400).json({ message: "Please enter a valid email address."});
    } else {
        next();
    }
};