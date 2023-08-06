// Controllers are the "Task Executors". They contain the logic and business operations of the application. Controllers receive requests from the routes, process the data, interact with the models for data retrieval or manipulation, and formulate the appropriate responses to be sent back to the clients.
// Controllers: handle the logic for each API endpoint... handle incoming requests, interact with the database through the models, and return the appropriate responses.
// IMPORTS
require('dotenv').config(); // Loads environment variables from a .env file
const bcrypt = require('bcrypt'); // Library for password hashing
const jwt = require('jsonwebtoken'); // Library for generating JSON Web Tokens (JWT)

const User = require('../models/user'); // User model

// SIGNUP
exports.signup = (req, res, next) => { // This line exports the signup controller function, which takes in the HTTP request (req), response (res), and next middleware function (next) as parameters to handle user signup requests.
  console.log('Received signup request:', req.body); // This line logs the message "Received signup request:" along with the contents of the request body (req.body) to the console, providing visibility into the data received from the client during user signup.

  User.findOne({ email: req.body.email }) // This line queries the database to find a user document with the specified email provided in the request body (req.body.email) using the Mongoose 'findOne' method, imported by the user model, which is imported here, enabling the server to check if a user with the given email already exists.
    .then(existingUser => { // Then, the code inside the following block is executed to handle the retrieved existingUser data from the database. It checks if existingUser is truthy, which indicates that a user with the provided email already exists in the database. If this condition is met, the code proceeds to send a response with a status code of 400 and a JSON object indicating that a user with the given email already exists, preventing the creation of a duplicate user account.
      if (existingUser) { // If the 'existingUser' variable contains a truthy value, indicating that a user with the provided email already exists in the database, the code block inside the 'if' statement will be executed.
        return res.status(400).json({ error: 'User with this email already exists!' }); // If the 'existingUser' variable is truthy, indicating that a user with the provided email already exists in the database, the code returns a JSON response with a status code of 400 and an error message.
      }

      bcrypt.hash(req.body.password, 10) // The 'bcrypt.hash' function is used to securely hash the plain-text password from 'req.body.password' with a salt level of 10, which determines the complexity of the hashing algorithm used to protect the user's password.
        .then(hash => { // Then, the code inside the following block assigns the generated 'hash' (resulting from the password hashing process) to the variable 'hash', preparing to create and save a new 'User' object with the hashed password.
          const user = new User({ // Creates a new 'User' object with the provided email and hashed password obtained from the previous steps.
            email: req.body.email, // Assigns the email property of the 'User' object with the value obtained from the 'req.body.email' parameter, which represents the email submitted in the signup request.
            password: hash // Assigns the password property of the 'User' object with the value 'hash', which is the hashed password generated using bcrypt.
          });
          // Save the user to the database.
          user.save() // Saves the 'user' object, representing a new user with the hashed password, into the database.
            .then(() => { // Then, after successfully saving the 'user' object into the database, the following code block will be executed.
              console.log('User created:', user); // This 'console.log' statement logs the message 'User created:' along with the 'user' object to the console, providing visibility into the details of the newly created user during development or debugging processes.
              res.status(201).json({ message: 'User created!' }); // This code sends a JSON response with a status code of 201 (Created) and a message 'User created!' to the client, indicating that the user creation was successful.
            })
            .catch(error => { // Error handling for any unexpected errors that may occur while saving the new user object to the database during the signup process. Logs the error message to the console indicating the error details. Responds with a JSON object containing the error details and a status code of 400 (Bad Request) to the client.
              console.log('Error saving user:', error); // Logs an error message along with the error details to the console when there is an error saving the user to the database.
              res.status(400).json({ error }); // Sends a JSON response with a status code of 400 (Bad Request) and the error details in the response body when there is an error saving the user to the database.
            });
        })
        .catch(error => { // Error handling for any unexpected errors that may occur during the password hashing process. Logs the error message 'Error hashing password:' along with the error details to the console. Responds with a JSON object containing the error details and a status code of 500 (Internal Server Error) to the client.
          console.log('Error hashing password:', error); // Logs an error message 'Error hashing password:' along with the error details to the console when there is an error during the password hashing process.
          res.status(500).json({ error }); // Sends a JSON response with a status code of 500 (Internal Server Error) and an error object containing the error details when there is an internal server error during the password hashing process.
        });
    })
    .catch(error => { // Error handling for any unexpected errors that may occur while trying to find a user in the database during the signup process. Logs the error message to the console indicating the error details. Responds with a JSON object containing the error details and a status code of 500 (Internal Server Error) to the client.
      console.log('Error finding user:', error); // Logs an error message to the console indicating that there was an error while trying to find a user in the database during the signup process.
      res.status(500).json({ error }); // Responds with a 500 status code and sends a JSON object containing the error details when there was an error finding a user in the database during the signup process.
    });
};

// LOGIN
exports.login = (req, res, next) => { // This line exports the login controller function, which handles user login requests, by taking in the HTTP request (req), response (res), and next middleware function (next) as parameters.
  User // 'User' here refers to the Mongoose model representing the user schema, which allows interaction with the MongoDB database collection for user data.
    .findOne({ email: req.body.email }) // This code performs a database query using the 'findOne' method of the 'User' model to find a user document in the MongoDB database collection based on the email provided in the request body (req.body.email).
    .then((user) => { // Then, the code inside the following block is executed to handle the retrieved 'user' data from the database after the successful database query.
      if (!user) { // If the 'user' variable is not truthy (falsy, null, undefined, or false), symbolized by the presence of a '!' (not operator) before the variable, after querying the database for a user with the provided email, the code inside the block executes. It returns a JSON response with a status code of 401 and an error object containing the message 'User not found!' to handle the scenario where the user does not exist during the login process.
        // User not found
        return res.status(401).json({ error: 'User not found!' }); // If the 'user' variable is falsy (null, undefined, false, 0, etc.), indicating that no user with the provided email was found in the database, the code returns a JSON response with a status code of 401 (Unauthorized) and an error message "User not found!" to the client, indicating that the login attempt is unauthorized because the user does not exist.
      }
      bcrypt // a library that is commonly used for password hashing and comparison in Node.js apps; it provides a secure and computationally expensive way to hash passwords, making them resistant to brute-force attacks.
        .compare(req.body.password, user.password) // compare method of bcrypt is used to internally hash the plain text password entered by a user during the login process, using the same salt and algorithm used to hash the stored password, and then compares the resulting hash of the plain text password entered with a hashed password stored in the database.
        .then(valid => { // Then, the code inside the following block is executed to handle the retrieved 'user' data from the database after the successful database query.
          if (!valid) { // If the 'valid' variable is falsy, indicating that the provided password in the login request did not match the hashed password stored in the user document in the database, the code block inside the 'if' statement will be executed.
            // Incorrect password
            return res.status(401).json({ error: 'Incorrect password!' }); // Return a JSON response with a status code of 401 (Unauthorized) and an error object containing the message 'Incorrect password!' to inform the client that the provided password in the login request does not match the hashed password stored in the user document in the database, indicating that the login credentials are invalid. This response is returned when the 'valid' variable is falsy, signifying that the password comparison during the login process was unsuccessful.  }
          }
          // Generate a token for authentication; When a JWT is generated, it consists of 3 parts: a header, a payload, and a signature. The header and payload contain the encoded information, while the signature ensures the integrity of the token.
          res.status(200).json({ // If the login credentials are valid and the password matches the hashed password stored in the user document in the database, the code returns a JSON response with a status code of 200 (OK) and a JSON object containing the user data, allowing the client to proceed with successful authentication and access protected resources.
            userId: user._id, // In the JSON response returned upon successful authentication, the 'userId' field is included, containing the value of 'user._id', which represents the unique identifier (MongoDB ObjectId) of the authenticated user. This allows the client to associate the user's ID with their session or further actions.
            token: jwt.sign( // The 'token' field in the JSON response is generated using the 'jwt.sign' method, which takes in a payload (usually containing user-specific data) and a secret key to create a unique JSON Web Token (JWT) for the authenticated user. This token can be used by the client to authenticate subsequent requests to protected routes on the server, ensuring the user's identity and preventing unauthorized access.
              { userId: user._id }, // The payload provided to 'jwt.sign' includes the 'userId' property, which is set to the '_id' of the user object retrieved from the database. This information will be used to identify the user associated with the token when the client includes the token in subsequent requests to the server.
              process.env.RANDOM_SECRET_TOKEN, // The 'process.env.RANDOM_SECRET_TOKEN' represents the environment variable storing the random secret key used for signing the JSON Web Token (JWT), ensuring the token's security and uniqueness and preventing unauthorized tampering or decoding of its content.
              { expiresIn: '48h' } // The '{ expiresIn: '48h' }' sets the expiration time for the JSON Web Token (JWT) to 48 hours from its creation. This means the token will be valid for authentication purposes for a period of 48 hours after it's generated, enhancing security by ensuring tokens are not valid indefinitely.
            ) // The JWT specification allows for the inclusion of various standard and custom claims (parameters) in the token payload, such as 'exp' (Expiration Time) for defining the function to specify token validity duration through 'expiresIn' or alternatively, 'expiresAt', 'sub' (Subject) for indicating the function 'subject' that denotes the token's subject, 'iss' (Issuer) representing the function 'issuer' to define the token issuer, 'iat' (Issued At) specifying the function 'issuedAt' to denote token issuance time, and 'aud' (Audience) identifying the function 'audience' to specify the token's intended recipient.
            // Custom claims in JWT, such as 'userId: user._id,' enable developers to include application-specific data in the token payload, extending its usage beyond standard claims like 'exp' (Expiration Time), 'sub' (Subject), 'iss' (Issuer), 'iat' (Issued At), and 'aud' (Audience). Additional examples of custom claims might include user roles (implemented by functions such as 'userRole: getRole(userId)'), permissions (using 'permissions: getPermissions(userId)'), or any other relevant user-specific information that enhances the token's utility and security.
          });
        })
        .catch(error => res.status(500).json({ error })); // This '.catch' block is responsible for handling errors that might occur during the password comparison process. If an error occurs, it catches the error, and in response, sends a JSON object with a status code of 500 (Internal Server Error) and an 'error' field containing the details of the encountered error. This allows for appropriate error handling and informs the client about the internal server error that occurred during the password comparison process.
    })
    .catch(error => res.status(500).json({ error })); // This '.catch' block serves as a global error handler for the entire login controller function. If any errors occur during the execution of the database query or the password comparison process, this block will catch those errors. It then sends a JSON response with a status code of 500 (Internal Server Error) and an error object containing the error details. This ensures that any unexpected errors during the login process are properly handled and do not expose sensitive information to the client.
};
