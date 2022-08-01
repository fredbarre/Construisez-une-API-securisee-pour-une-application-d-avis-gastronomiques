const mongodb = require("../managers/mongoDB");

let sauceModel = require("../models/sauceModel");

exports.getSauces = async function (req, res) {
  try {
    let sauces = await sauceModel.find();
    //console.log(sauce);
    res.status(200).json({ sauces });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getSauce = async function (req, res) {
  try {
    let sauce = await sauceModel.findOne({ _id: req.params.id });
    res.status(200).json({ sauce });
    //console.log(sauce);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.newSauce = function (req, res) {
  /*console.log(req);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObjetct._id;*/
  const sauce = new sauceModel({
    /*...sauceObject,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    usersDisliked: [],*/
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateSauce = function (req, res) {};

exports.deleteSauce = async function (req, res) {
  try {
    let sauce = await sauceModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "sauce supprimée" });
    //console.log(sauce);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.setLike = async function (req, res) {
  try {
    let sauce = await sauceModel.findOne({ _id: req.params.id });
    await sauceModel.udapteOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    );
    res.status(200).json({ message: "sauce supprimée" });
    //console.log(sauce);
  } catch (error) {
    res.status(400).json({ error });
  }
};
