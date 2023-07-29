// Controllers are the "Task Executors". They contain the logic and business operations of the application. Controllers receive requests from the routes, process the data, interact with the models for data retrieval or manipulation, and formulate the appropriate responses to be sent back to the clients.
// Controllers: handle the logic for each API endpoint... handle incoming requests, interact with the database through the models, and return the appropriate responses.
// IMPORTS
require('dotenv').config(); // Loads environment variables from a .env file
const bcrypt = require('bcrypt'); // Library for password hashing
const maskData = require('maskdata'); // Library for data masking
const jwt = require('jsonwebtoken'); // Library for generating JSON Web Tokens (JWT)
const express = require('express'); // Express framework

const User = require('../models/user'); // User model
// const passwordSchema = require('../models/password'); // Password model


// SIGNUP
exports.signup = (req, res, next) => {
  console.log('Received signup request:', req.body);

  User.findOne({ email: req.body.email })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists!' });
      }

      const validationResult = User.passwordSchema.validate(req.body.password, { list: true });
      console.log('Password validation result:', validationResult);

      if (validationResult.length > 0) {
        const errorMessages = validationResult.map((error) => {
          switch (error) {
            case 'min':
              return 'The password must be at least 8 characters long.';
            case 'max':
              return 'The password cannot exceed 15 characters.';
            case 'uppercase':
              return 'The password must contain at least one uppercase letter.';
            case 'lowercase':
              return 'The password must contain at least one lowercase letter.';
            case 'digits':
              return 'The password must contain at least one digit.';
            case 'spaces':
              return 'The password cannot contain spaces.';
            case 'oneOf':
              return 'The password must not be one of the common passwords.';
            default:
              return 'Invalid password.';
          }
        });

        console.log('Password validation errors:', errorMessages);

        return res.status(400).json({ errors: errorMessages });
      }

      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            // OPTION: Mask data
            // email: maskData.maskEmail2(req.body.email, emailMask2options),
            email: req.body.email,
            password: hash
          });
          // Save the user to the database.
          user.save()
            .then(() => {
              console.log('User created:', user);
              res.status(201).json({ message: 'User created!' });
            })
            .catch(error => {
              console.log('Error saving user:', error);
              res.status(400).json({ error });
            });
        })
        .catch(error => {
          console.log('Error hashing password:', error);
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      console.log('Error finding user:', error);
      res.status(500).json({error});
    });
  };

  // LOGIN
  exports.login = (req, res, next) => {
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).json({ error: 'User not found!' });
        }
        bcrypt // a library that is commonly used for password hashing and comparison in Node.js apps; it provides a secure and computationally expensive way to hash passwords, making them resistant to brute-force attacks.
          .compare(req.body.password, user.password) // compare method of bcrypt is used to internally hash the plain text password entered by a user during the login process, using the same salt and algorithm used to hash the stored password, and then compares the resulting hash of the plain text password entered with a hashed password stored in the database.
          .then(valid => {
            if (!valid) {
              // Incorrect password
              return res.status(401).json({ error: 'Incorrect password!' });
            }
            // Generate a token for authentication; When a JWT is generated, it consists of 3 parts: a header, a payload, and a signature. The header and payload contain the encoded information, while the signature ensures the integrity of the token.
            res.status(200).json({ // response status of 200 indicates a successful request; means the server has processed the request and is sending back a valid response.
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.RANDOM_SECRET_TOKEN,
                { expiresIn: '48h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
