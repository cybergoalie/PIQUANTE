const crypto = require('crypto');

const randomBytes = crypto.randomBytes(64);
const randomSecretToken = randomBytes.toString('hex');
console.log(randomSecretToken);