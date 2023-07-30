// IMPORTS
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
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
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