// IMPORT
const passwordSchema = require('../models/password');

// EXPORT
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ message: "The password must be between 8 and 15 characters long, and must contain at least one uppercase letter, one lowercase letter, and one digit." });
    } else {
        next();
    }
};
