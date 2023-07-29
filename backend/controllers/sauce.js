// Controllers are the "Task Executors". They contain the logic and business operations of the application. Controllers receive requests from the routes, process the data, interact with the models for data retrieval or manipulation, and formulate the appropriate responses to be sent back to the clients.
// Controllers: handle the logic for each API endpoint... handle incoming requests, interact with the database through the models, and return the appropriate responses.
// IMPORTS
const Sauce = require('../models/sauce');
const fs = require('fs');

// CREATE A SAUCE
exports.createSauce = (req, res, next) => {

  let sauceObject; //  This variable is declared to store the sauce data that will be saved to the database. Initially, it is set to undefined.
  let imageUrl = null; 

  if (req.file) { // translates to 'if there is a file in the request; if there is a file, it means the user has uploaded an image for the sauce, in which case the if block is executed
    sauceObject = JSON.parse(req.body.sauce); // means that if there is a file, the sauce data is stored in `req.body.sauce` as a JSON string; this line parses that JSON string and assigns it to `sauceObject , so now `sauceObject  contains the sauce data extracted from `req.body.sauce`. 
    imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // this sets the `imageUrl` variable to the URL of the uploaded image; constructs the image URL using the `req.protocol(HTTP/HTTPS), `req.get('host')` (the host/domain of the server) and the `req.file.filename` (the name of the uploaded image file). This URL will be used to store the image in the server and, if needed, associate it with the sauce object.
    
    // sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; // Set the imageUrl when an image is uploaded (actually, the above 2 lines put together)

  } else { // if there is no file (`req.file` is falsy), this means the user did not upload an image. In this case the code inside the `else` block is executed.
    sauceObject = req.body; // this line means the sauce data is directly available in req.body and the entire req.body is to be assigned to the sauceObject.
  }

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  sauce.save()
    .then(() => { 
      console.log('Sauce created:', req.body.sauce);
      res.status(201).json({ message: 'Sauce saved!' });
    })
    .catch(error => res.status(400).json({ error }));
};

// ADD OR REMOVE A LIKE OR DISLIKE
exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1) {  // Like
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
      .then(() => res.status(200).json({ message: 'Like added!' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) {  // Dislike
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
      .then(() => res.status(200).json({ message: 'Dislike added!' }))
      .catch(error => res.status(400).json({ error }));
  } else {  // Remove like or dislike
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
            .then(() => res.status(200).json({ message: 'Like removed!' }))
            .catch(error => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
            .then(() => res.status(200).json({ message: 'Dislike removed!' }))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};

// GET ONE SAUCE
exports.getOneSauce = (req, res, next) => { // the getOneSauce function is responsible for retrieving a specific sauce from the db based on the given sauce ID.. first the function takes in 3 parameters, which represent the request, response, and next middleware function in the Express middleware chain, respectively; Inside the Sauce.findOne is used to search for a sauce in the db that matches the provided sauce ID
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// MODIFY A SAUCE
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object modified!' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE A SAUCE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Object deleted!' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// GET ALL SAUCES
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};
