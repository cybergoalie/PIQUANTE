const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
 email: { type: String, required: true, unique: true },
 password: {type: String, required: true }
});

// CONTROLE D'UNICITE

userSchema.plugin(uniqueValidator);

// Export

module.exports = mongoose.model('User', userSchema);



