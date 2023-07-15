// Models:  Define Mongoose models to represent your data structures in MongoDB
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // String — the MongoDB unique identifier for the user who created the sauce.
    name: { type: String, required: true }, // String — name of the sauce.
    manufacturer: { type: String, required: true }, // String — manufacturer of the sauce.
    description: { type: String, required: true }, // String — description of the sauce.
    mainPepper: { type: String, required: true }, // String — the main pepper ingredient in the sauce.
    imageUrl: { type: String, required: true }, // String — the URL for the picture of the sauce uploaded by the user.
    heat: { type: Number, required: false, default: 0 }, // Number — a number between 1 and 10 describing the sauce.
    likes:  { type: Number, required: false, default: 0 }, // Number — the number of users liking the sauce.
    dislikes: { type: Number, required: true }, //  Number — the number of users disliking the sauce.
    usersLiked:  { type: Array, required: false, default: [] }, // an array of user IDs of those who have liked the sauce.
    usersDisliked: { type: Array, required: false, default: [] }, // an array of user IDs of those who have disliked the sauce.
});

module.exports = mongoose.model('Sauce', sauceSchema);