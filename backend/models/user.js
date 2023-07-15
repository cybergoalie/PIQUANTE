const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const passwordSchema = require('./password'); // Import the password validation schema

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return passwordSchema.validate(value); // Use the password validation schema
      },
      message: 'Invalid password',
    },
  },
});

// UNIQUENESS CONTROL

userSchema.plugin(uniqueValidator);

// Export

module.exports = mongoose.model('User', userSchema);





