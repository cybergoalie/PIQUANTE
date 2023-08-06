// This file serves as the main entry point for the backend server; it handles server setup, port configuration, MongoDB connection, and startup error handling
//  IMPORTS
require('dotenv').config();
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

/**
 * CONFIGURATION OF PORTS:
 * Normalizes a port into a number, string, or false.
 * @param {string} val - The port value to normalize.
 * @returns {(number|string|boolean)} - The normalized port.
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


/**
 * Error handler for server startup errors.
 * @param {Error} error - The error object.
 * @throws {Error} - Throws error if the error is not related to listening.
 */
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES': // stands for "Error - Access Denied"
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE': // stands for "Error - Address already in use."
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Connect to MongoDB using Mongoose before creating server (ENSURES DATA IS SECURED)
mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((mongoose) => {
        mongoose.plugin(mongodbErrorHandler);
        console.log('Connected to MongoDB');

        // Create HTTP server
        const server = http.createServer(app);

        /**
        * Error handler for server startup errors.
        * @param {Error} error - The error object.
        * @throws {Error} - Throws error if the error is not related to listening.
        */
        server.on('error', errorHandler);
        /**
        * Event listener for server "listening" event.
        */
        server.on('listening', () => {
            const address = server.address();
            const bind =
                typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
            console.log('Listening on ' + bind);
        });

        // Start the server
        server.listen(port);
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

    // Your .env file in the backend folder should look like this:

// # DB_CONNECTION_STRING: Specifies the connection string for MongoDB, including the necessary credentials and host information.
// DB_CONNECTION_STRING=mongodb+srv://<here goes your MongoDb username and remove the <> symbols too>:<here goes your MongoDb password belonging to your username and remove the <> symbols too>MDB@cluster0.ytlwqif.mongodb.net/Piquante?retryWrites=true&w=majority

// # DB_NAME: Specifies the name of the MongoDB database to use for the Piquante application.
// DB_NAME=here goes your MongoDb database name (case-sensitive)

// # RANDOM_SECRET_TOKEN: Specifies a random secret token to be used for generating and validating secure tokens, such as JWTs.
// RANDOM_SECRET_TOKEN=417 etc. // Generate a 64 byte/512bit/128 character key with this crypto.js script: const crypto=require('crypto');const generateRandomToken=length=>crypto.randomBytes(length).toString('hex');const randomSecretToken=generateRandomToken(64);console.log('RANDOM_SECRET_TOKEN:',randomSecretToken); and check the console log for the string.

// # the above are imported by server.js
