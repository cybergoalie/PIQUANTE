// Controllers are the "Task Executors". They contain the logic and business operations of the application. Controllers receive requests from the routes, process the data, interact with the models for data retrieval or manipulation, and formulate the appropriate responses to be sent back to the clients.
// Controllers: handle the logic for each API endpoint... handle incoming requests, interact with the database through the models, and return the appropriate responses.
// IMPORTS
const Sauce = require('../models/sauce'); // The 'const Sauce' statement imports the 'sauce' model or schema defined in the '../models/sauce' file, allowing access to the functionalities and structure of the 'sauce' data model in this particular file. This enables interaction with the database collection associated with sauce items through the 'Sauce' variable.
const fs = require('fs'); // The 'const fs' statement imports the 'fs' module from Node.js, which stands for 'file system'. This module provides functions to interact with the file system, allowing operations such as reading and writing files. The 'fs' variable can now be used to access these file system functionalities within the current file.

// CREATE A SAUCE
exports.createSauce = (req, res, next) => { // The 'createSauce' function serves as an endpoint handler responsible for handling HTTP POST requests to create a new sauce item on the server. The function is designed to receive and process the request data (e.g., sauce details) from 'req.body', and subsequently respond to the client's request with relevant status codes and JSON data. The 'next' parameter is included to allow passing control to the next middleware function in the Express.js application's request-response cycle.
  console.log('Sauce created:', req.body.sauce); // The 'console.log' statement logs the message 'Sauce created:' along with the contents of 'req.body.sauce' to the console, providing visibility into the details of the newly created sauce item in the server's backend during development or debugging processes.
  let sauceObject; // The 'sauceObject' variable is declared in the current scope, allowing it to be used later in the function to store and manipulate data related to a sauce item.
  let imageUrl = null; // The 'imageUrl' variable is declared and initialized with the value 'null', indicating that it will be used to store the URL of an image associated with the sauce item, but it currently has no value assigned to it.
  if (req.file) { // This 'if' statement checks if 'req.file' exists and evaluates to truthy, indicating that an image file has been uploaded in the request. The block of code inside the 'if' statement will be executed if an image is present, allowing further processing of the uploaded image.    
    sauceObject = JSON.parse(req.body.sauce); // The code assigns the parsed JSON object from 'req.body.sauce' to the 'sauceObject' variable, allowing the server to access and manipulate the data contained within the request body related to a sauce item as a JavaScript object.
    imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; //Dynamically generate the complete URL by combining the protocol, hostname, and filename using string interpolation with ${} placeholders inside backticks.
  } else { // This 'else' block of code is executed when the preceding 'if' condition evaluates to false, indicating that no image file was uploaded in the request. In this case, the server proceeds with other operations related to the sauce item without image processing.
    sauceObject = req.body; // The 'sauceObject' variable is assigned the value of 'req.body', which contains the data sent in the request body. This allows the server to access and process the incoming data related to a sauce item.
  }

  const sauce = new Sauce({ // The 'const sauce' variable is declared and initialized as a new instance of the 'Sauce' model or schema, which represents a new sauce item to be created and stored in the database. The upcoming lines of code will populate the properties of this 'sauce' object with the data received in the request body, preparing it for database insertion.
    ...sauceObject, // The properties of the 'sauce' object are being populated with the data from the 'sauceObject' variable using object spread syntax ('...sauceObject'), which efficiently copies all the properties and values from 'sauceObject' into the 'sauce' object. This allows for a concise way to assign multiple properties at once while creating a new sauce item.
    imageUrl, // Remove Validators.required from line 59 in the frontend sauce-form-component.ts in order to be able to submit the form without an image affixed... change to image: [null]
    likes: 0, // This defines a property called likes and initializes it with a value of 0. This property will be used to store the total number of likes for the "Sauce" item. As users like the sauce, this value will be incremented accordingly.
    dislikes: 0, //  This defines another property called dislikes and initializes it with a value of 0. Similarly, this property will be used to store the total number of dislikes for the "Sauce" item. As users dislike the sauce, this value will be incremented accordingly.
    usersLiked: [], // This defines an array property called usersLiked.
    usersDisliked: [] // This defines another array property called usersDisliked. Similarly, when a new "Sauce" object is created, this property will be initialized as an empty array. As users dislike the sauce, their user IDs will be added to this array.
  });
  sauce.save() // The 'sauce.save()' function is called on the 'sauce' object, which initiates the process of saving the newly created sauce item into the database, persisting the data for future retrieval and management.
    .then(() => res.status(201).json({ message: 'Object saved!' })) // Then, if the saving operation is successful, indicated by the response status code of 201 (Created), this code sends a JSON response with the message 'Object saved!'.
    .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
};

// ADD OR REMOVE A LIKE OR DISLIKE
exports.likeSauce = (req, res, next) => { // This controller handles user actions related to liking or disliking the "Sauce" item, updating counters, and managing user interactions based on the 'like' property in the request body.
  if (req.body.like === 1) {  // Like // If the 'like' property in the request body is strictly equal to 1, this conditional block of code is executed to handle the case where the user wants to add a "like" for the "Sauce" item.
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }) // Update the "Sauce" document with the given ID by adding the user's ID to the "usersLiked" array and incrementing the "likes" count by 1.
      .then(() => res.status(200).json({ message: 'Like added!' })) // Then, if the like operation is successful, indicated by the response status code of 200, this code sends a JSON response reading 'Like added!'.
      .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
  } else if (req.body.like === -1) {  // Dislike // This block is executed if the 'like' property in the request body is strictly equal to -1, representing a dislike operation for the "Sauce" item, where the code inside this block handles updating the total number of dislikes and related user information.
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }) // Update the "Sauce" document with the given ID by adding the user's ID to the "usersDisliked" array and incrementing the "dislikes" count by 1.
      .then(() => res.status(200).json({ message: 'Dislike added!' })) // Then, once the "Dislike" operation is successfully completed, indicated by the absence of errors, this code sends a JSON response with a status code of 200 (OK) and a message 'Dislike added!'.
      .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
  } else {  // Remove like or dislike // If the 'like' property in the request body does not equal 1 or -1, this block of code is executed to handle the case where the user wants to remove their previous like or dislike for the "Sauce" item. The code inside this block involves using the $pull operator to update the array that stores the user IDs for likes or dislikes, removing the user's ID from the array to unregister their like or dislike.
    Sauce.findOne({ _id: req.params.id }) // Find the "Sauce" document with the given ID.
      .then(sauce => {  // After a successful operation (likely fetching a "Sauce" item from the database), this block handles the retrieved 'sauce' data, enabling further processing or preparation for a response to the client.
        if (sauce.usersLiked.includes(req.body.userId)) { // This conditional block checks if the 'usersLiked' array property of the 'sauce' contains the 'userId' from the request body, indicating that the user has already liked the "Sauce" item, and handles relevant logic or error handling for such scenarios.
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // Update the "Sauce" document with the given ID by removing the user's ID from the "usersDisliked" array and decrementing the "dislikes" count by 1.
            .then(() => res.status(200).json({ message: 'Like removed!' })) // Then, after successfully removing the like for the "Sauce" item, indicated by the absence of errors, this code sends a JSON response with a status code of 200 (OK) and a message 'Like removed!'.
            .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
        } else if (sauce.usersDisliked.includes(req.body.userId)) { // This conditional block checks if the 'usersDisliked' array property of the 'sauce' contains the 'userId' from the request body, indicating that the user has already disliked the "Sauce" item, and handles relevant logic or error handling for such scenarios.
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }) // Update the "Sauce" document with the given ID by removing the user's ID from the "usersDisliked" array and decrementing the "dislikes" count by 1.
            .then(() => res.status(200).json({ message: 'Dislike removed!' })) // Then, after successfully removing the dislike for the "Sauce" item, indicated by the absence of errors, this code sends a JSON response with a status code of 200 (OK) and a message 'Dislike removed!'.
            .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
        }
      })
      .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
  }
};

// GET ONE SAUCE
exports.getOneSauce = (req, res, next) => { // The getOneSauce function is responsible for retrieving a specific sauce from the db based on the given sauce ID.. first the function takes in 3 parameters, which represent the request, response, and next middleware function in the Express middleware chain, respectively; Inside the Sauce.findOne is used to search for a sauce in the db that matches the provided sauce ID
  Sauce.findOne({ _id: req.params.id }) // This code initiates a query to find a "Sauce" item in the database based on the provided '_id' parameter from the request parameters.
    .then(sauce => res.status(200).json(sauce)) // Then, after successfully retrieving the "Sauce" item from the database, this code sends a JSON response with a status code of 200 (OK) containing the retrieved 'sauce' data.
    .catch(error => res.status(404).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 404 (Not Found), and sends a JSON response containing the error details.
};

// MODIFY A SAUCE
exports.modifySauce = (req, res, next) => { // This controller handles the modification/update of an existing "Sauce" item based on the request parameters and body data, involving tasks such as updating the database, handling validation, and managing user authentication.
  const sauceObject = req.file ? // This code creates a 'sauceObject' variable, which is initialized to the result of a ternary operator that checks if 'req.file' exists, and if so, assigns the value of 'req.file' to 'sauceObject'; otherwise, it assigns 'undefined' to 'sauceObject'.
  // In the context of the provided code (const sauceObject = req.file ?), the ternary operator checks if req.file exists and is truthy. If req.file exists (i.e., it is not null, undefined, 0, an empty string, or false), then sauceObject will be assigned the value of req.file. If req.file is falsy (null or undefined), then sauceObject will be assigned the value undefined.  
  {
      ...JSON.parse(req.body.sauce), // The code uses object rest spread (the '...') to extract all properties from the parsed 'req.body.sauce' object and insert them into a new object.
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // The code merges the properties from the 'req.body' object with the existing object () using the spread syntax.
    // The code uses object rest spread (the '...') to copy all properties from 'req.body' into the 'sauceObject' if 'req.file' exists; otherwise, 'sauceObject' will contain all properties from 'req.body'.
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // The code updates a sauce object in the database by merging the properties from 'sauceObject' while keeping the original '_id' intact, using 'Sauce.updateOne' method with '_id: req.params.id' to identify the specific sauce to update.
    .then(() => res.status(200).json({ message: 'Object modified!' })) // Sends a JSON response with the message 'Object modified!' when the modification operation is successful, indicated by a 200 status code as a response.
    .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
};

// DELETE A SAUCE
exports.deleteSauce = (req, res, next) => { // This exports a function to handle the deletion of a sauce from the database, called when a corresponding HTTP request is made with 'req' (request) and 'res' (response) parameters.
  Sauce.findOne({ _id: req.params.id }) // The code queries the database to find a sauce with the specific '_id' provided in the 'req.params.id' parameter using 'Sauce.findOne' method.
    .then(sauce => { // After the successful execution of the previous operation, the code handles the retrieved 'sauce' data in the following '.then' block.
      if (!sauce) { // The code checks if the 'sauce' data is falsy (null or undefined) in order to verify if the queried sauce with the provided '_id' in the previous operation was not found in the database.
        return res.status(404).json({ message: 'Sauce not found!' }); // In case the sauce is not found, this code returns a JSON response with a status code of 404 (Not Found) and a message 'Sauce not found!'.
      }

      const filename = sauce.imageUrl.split('/images/')[1]; // Creates a constant 'filename' by extracting the filename part from the 'imageUrl' property of the 'sauce' object, utilizing the 'split' method with '/images/' as the separator and accessing the following element at index 1 in the resulting array.
      fs.unlink(`images/${filename}`, (err) => { // The code uses the 'fs.unlink' function to delete the image file with the given 'filename' from the 'images' folder; the callback function handles any errors that may occur during the deletion process.
        if (err) { // This conditional statement checks if there is an error ('err') during the execution of the previous 'fs.unlink' operation, and if so, the code proceeds inside the block to handle the error.
          console.error('Error deleting image:', err); // If an error occurs during the 'fs.unlink' operation, this code block will be executed, displaying an error message ('Error deleting image:') along with the error details (stored in the 'err' variable) using 'console.error'.
          return res.status(500).json({ error: 'Failed to delete image!' }); // If there's an error during the image deletion process, the code returns a JSON response with a 500 status code, containing an error message ('Failed to delete image!') to indicate that the deletion was not successful.
        }

        Sauce.deleteOne({ _id: req.params.id }) // This code uses the 'Sauce.deleteOne' method to delete a sauce from the database based on the '_id' provided in the 'req.params.id' parameter.
          .then(() => res.status(200).json({ message: 'Sauce deleted!' })) // After successfully deleting the sauce from the database, the code sends a JSON response with a 200 status code and a message ('Sauce deleted!') to indicate that the deletion operation was successful.
          .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
      });
    })
    .catch(error => res.status(500).json({ error })); // In the event of an error during the processing of the request, this code block catches the error, and the server responds with a JSON object containing a 500 status code and an 'error' property that holds the error details to indicate that there was an internal server error.
};

// GET ALL SAUCES
exports.getAllSauces = (req, res, next) => { // This 'getAllSauces' function represents an endpoint handler used to handle HTTP GET requests, enabling the retrieval of all sauce items from the server, and subsequently responding with the requested data in JSON format. The 'next' parameter is included to allow passing control to the next middleware function in the Express.js application's request-response cycle.
  Sauce.find() // The 'Sauce.find()' function is used to perform a query in the database to retrieve all sauce items.
    .then(sauces => res.status(200).json(sauces)) // Then, after successfully obtaining the sauces data, this code sends a JSON response with a status code of 200 (OK), serializing the 'sauces' data into JSON format and including it in the response body.
    .catch(error => res.status(400).json({ error })); // If an error occurs during the process, this code catches the error, sets the response status to 400 (Bad Request), and sends a JSON response with the error details.
};

// Understanding these categories is crucial for proper handling and communication of HTTP requests in web development. 
// If status codes are not handled appropriately, clients may misunderstand the request's outcome, encounter difficulties in error identification, experience inconsistent user experiences, and face challenges in processing data reliably.
// The 12 main HTTP status codes that a web developer should know include: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, and 500 Internal Server Error. 
// As of September 2021, there are a total of 71 HTTP status codes, that have been officially assigned specific meanings and uses in the HTTP protocol, distributed across the 5 categories of 1xx (Informational responses, 6 codes), 2xx (Successful responses, 24 codes), 3xx (Redirection messages, 8 codes), 4xx (Client error responses, 32 codes), and 5xx (Server error responses, 11 codes).





