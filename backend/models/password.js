const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(8) // Minimum length of 8 characters
  .is().max(15) // Maximum length of 15 characters
  .has().uppercase() // Must have at least one uppercase letter
  .has().lowercase() // Must have at least one lowercase letter
  .has().digits() // Must have at least one digit
  .has().not().spaces() // Must not contain spaces
  .is().not().oneOf(['password123', '12345678']);  // Must not be one of the common passwords

module.exports = passwordSchema;
