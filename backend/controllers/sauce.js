// Controllers are the "Task Executors". They contain the logic and business operations of the application. Controllers receive requests from the routes, process the data, interact with the models for data retrieval or manipulation, and formulate the appropriate responses to be sent back to the clients.
// Controllers: handle the logic for each API endpoint... handle incoming requests, interact with the database through the models, and return the appropriate responses.
// IMPORTS
const Sauce = require('../models/sauce');
const fs = require('fs');

// CREATE A SAUCE
exports.createSauce = (req, res, next) => {
  console.log('Sauce created:', req.body.sauce);
  let sauceObject;
  let imageUrl = null;
  if (req.file) {
    sauceObject = JSON.parse(req.body.sauce);
    imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`; //Dynamically generate the complete URL by combining the protocol, hostname, and filename using string interpolation with ${} placeholders inside backticks.
  } else {
    sauceObject = req.body;
  }

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl, // Remove Validators.required from line 59 in the frontend sauce-form-component.ts in order to be able to submit the form without an image affixed... change to image: [null]
    likes: 0, // This defines a property called likes and initializes it with a value of 0. This property will be used to store the total number of likes for the "Sauce" item. As users like the sauce, this value will be incremented accordingly.
    dislikes: 0, //  This defines another property called dislikes and initializes it with a value of 0. Similarly, this property will be used to store the total number of dislikes for the "Sauce" item. As users dislike the sauce, this value will be incremented accordingly.
    usersLiked: [], // This defines an array property called usersLiked.
    usersDisliked: [] // This defines another array property called usersDisliked. Similarly, when a new "Sauce" object is created, this property will be initialized as an empty array. As users dislike the sauce, their user IDs will be added to this array.
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Object saved!' }))
    .catch(error => res.status(400).json({ error }));
};

// ADD OR REMOVE A LIKE OR DISLIKE
exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1) {  // Like
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }) // Update the "Sauce" document with the given ID by adding the user's ID to the "usersLiked" array and incrementing the "likes" count by 1.
      .then(() => res.status(200).json({ message: 'Like added!' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) {  // Dislike
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }) // Update the "Sauce" document with the given ID by adding the user's ID to the "usersDisliked" array and incrementing the "dislikes" count by 1.
      .then(() => res.status(200).json({ message: 'Dislike added!' }))
      .catch(error => res.status(400).json({ error }));
  } else {  // Remove like or dislike
    Sauce.findOne({ _id: req.params.id }) // Find the "Sauce" document with the given ID.
      .then(sauce => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // Update the "Sauce" document with the given ID by removing the user's ID from the "usersDisliked" array and decrementing the "dislikes" count by 1.
            .then(() => res.status(200).json({ message: 'Like removed!' }))
            .catch(error => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }) // Update the "Sauce" document with the given ID by removing the user's ID from the "usersDisliked" array and decrementing the "dislikes" count by 1.
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
      if (!sauce) {
        return res.status(404).json({ message: 'Sauce not found!' });
      }

      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return res.status(500).json({ error: 'Failed to delete image!' });
        }

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce deleted!' }))
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
