const rateLimit = require('express-rate-limit');

// Configuration
const max = rateLimit({
  windowMs: 5 * 60 * 1000, // Time window in milliseconds (5 minutes)
  max: 3, // Maximum number of attempts allowed
  message: "Your account is blocked for 5 minutes after 3 unsuccessful attempts.",
});

// Export
module.exports = { max };
