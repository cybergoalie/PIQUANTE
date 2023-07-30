// Models act as the "Data Managers". They represent the structure and logic of the data used in the application. Models handle the interaction with the database, define data validation rules, and provide methods for querying and manipulating data. Aka  a schema wrapper. The model acts as an interface to the database and provides a way to interact with the MongoDB collection based on the defined schema.
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({ //  defines a Mongoose schema named 'userSchema' with two fields: 'email' as a required unique string and 'password' as a required string.
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
});

// UNIQUENESS CONTROL

userSchema.plugin(uniqueValidator); // This line adds the 'uniqueValidator' plugin to the 'userSchema' in Mongoose, enabling validation for unique fields in the schema before exporting the 'User' model.

// Export

module.exports = mongoose.model('User', userSchema); // Exports the Mongoose model named 'User,' created using the 'userSchema' function; The User model is used to perform CRUD (Create, Read, Update, Delete) operations on the MongoDB collection named 'users' (Mongoose, by default, will pluralize this name to determine the collection name in the database... so, if the model name is 'User,' Mongoose will look for a collection named 'users' in the database) based on the schema definition provided by userSchema.





