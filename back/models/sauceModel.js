const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true,min: 1,max: 10 },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    userLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

let sauceModel = mongoose.model("sauce", sauceSchema);
module.exports = sauceModel;