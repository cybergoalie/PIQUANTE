// IMPORT: sets up the configuration for file upload using Multer middleware.
const multer = require('multer'); 


// ACCEPTED FILE TYPES: defines using MIME_TYPES, which maps file MIME types to their corresponding file extensions.
const MIME_TYPES = { 
  'image/jpg': 'jpg', 
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// CONFIGURATION
// Set up disk storage configuration for multer
const storage = multer.diskStorage({ // Define a disk storage configuration for the Multer middleware using the multer.diskStorage function and assign it to the storage variable
  destination: (req, file, callback) => { // Defines the destination property of the Multer middleware, where req represents the incoming request, file contains information about the uploaded file, and callback is a function used to indicate the destination directory for storing the uploaded files
    callback(null, 'images'); // Specify the directory where the uploaded files will be stored
  },
  filename: (req, file, callback) => { // Defines the filename property of the Multer disk storage, where req represents the incoming request, file contains information about the uploaded file, and callback is a function used to construct the filename for storing the uploaded file
    const name = file.originalname.split(' ').join('_'); // Replace spaces in the original filename with underscores
    const extension = MIME_TYPES[file.mimetype]; // Get the file extension based on the MIME type
    callback(null, name + Date.now() + '.' + extension); // Construct the filename by appending the current timestamp and the file extension
  }
});

// EXPORT
// Create and export multer middleware with the configured storage and single file upload
module.exports = multer({ storage: storage }).single('image'); // exports a Multer middleware configured to handle single file uploads using the disk storage defined earlier
