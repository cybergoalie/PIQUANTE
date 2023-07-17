// Controllers: handle the logic for each API endpoint... handle incoming requests, interact with the database through the models, and return the appropriate responses.
// IMPORTS
const Sauce = require('../models/Sauce');
const fs = require('fs');

// CREATE A SAUCE
exports.createSauce = (req, res, next) => {
  console.log('Sauce created:', req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Object saved!' }))
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
