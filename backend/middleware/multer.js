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
// Set up disk storage for multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Specify the directory where the uploaded files will be stored
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Replace spaces in the original filename with underscores
    const extension = MIME_TYPES[file.mimetype]; // Get the file extension based on the MIME type
    callback(null, name + Date.now() + '.' + extension); // Construct the filename by appending the current timestamp and the file extension
  }
});

// EXPORT
// Create and export multer middleware with the configured storage and single file upload
module.exports = multer({ storage: storage }).single('image');
