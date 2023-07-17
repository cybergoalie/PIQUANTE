// IMPORTS
const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const logger = require('../middleware/logger');
const multer = require('../middleware/multer');

// ROUTES
router.get('/', auth, logger, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, logger, sauceCtrl.getOneSauce);
router.put('/:id', auth, logger, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, logger, sauceCtrl.likeSauce);
router.delete('/:id', auth, logger, sauceCtrl.deleteSauce);

// EXPORT
module.exports = router;

// /**  
//  * Middleware for handling requests to '/api/stuff' endpoint.
//  * Returns a list of dummy data for demonstration purposes.
// */

// app.post('/api/stuff', (req, res, next) => {
//     console.log(req.body); // Log the request body to the console
//     const { title, description, imageUrl, price, userId } = req.body;
//     const thing = new Thing({
//       title,
//       description,
//       imageUrl,
//       price,
//       userId
//     });
//     thing.save().then(
//       () => {
//         res.status(201).json({
//           message: 'Thing saved successfully!'
//         });
//       }
//     ).catch(
//       (error) => {
//         res.status(400).json({
//           error: error
//         });
//       }
//     )
//   });
  
//   // Route to get a specific thing
  
//   app.get('/api/stuff/:id', (req, res, next) => {
//     Thing.findOne({
//       _id: req.params.id
//     }).then(
//       (thing) => {
//         if (!thing) {
//           return res.status(404).json({ error: 'Thing not found' });
//         }
//         res.status(200).json(thing);
//       })
//       .catch((error) => {
//         res.status(500).json({ error: error.message });
//       });
//   });
  
//   // Route to update the Thing (corresponding to the object you pass as a first argument. Use the id parameter passed in the request and replace it with the Thing passed as a second argument.
  
//   app.put('/api/stuff/:id', (req, res, next) => {
//     const thing = new Thing({
//       _id: req.params.id,
//       title: req.body.title,
//       description: req.body.description,
//       imageUrl: req.body.imageUrl,
//       price: req.body.price,
//       userId: req.body.userId
//     });
//     Thing.updateOne({_id: req.params.id}, thing).then(
//       () => {
//         res.status(201).json({
//           message: 'Thing updated successfully!'
//         });
//       }
//     ).catch(
//       (error) => {
//         res.status(400).json({
//           error: error
//         });
//       }
//     );
//   });
  
//   // Route to delete a Thing
  
//   app.delete('/api/stuff/:id', (req, res, next) => {
//     Thing.deleteOne({ _id: req.params.id })
//       .then(() => {
//         res.status(200).json({
//           message: 'Deleted!'
//         });
//       })
//       .catch((error) => {
//         res.status(400).json({
//           error: error
//         });
//       });
//   });
  
//   // Route to get all things
//   app.get('/api/stuff', (req, res, next) => {
//     Thing.find().then((things) => {
//       res.status(200).json(things);
//     })
//     .catch((error) => {
//       res.status(500).json({
//         error:error
//       });
//     });
//   });

