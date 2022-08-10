const mongodb = require("../managers/mongoDB");

const jwt = require("../managers/jwt");
let sauceModel = require("../models/sauceModel");

exports.getSauces = async function (req, res) {
  try {
    console.log("getSauces");
    let sauces = await sauceModel.find();
    console.log(sauces);
    res.status(200).json(sauces);
    //res.status(200).json()
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getSauce = async function (req, res) {
  try {
    let sauce = await sauceModel.findOne({ _id: req.params.id });
    res.status(200).json(sauce);
    /*console.log("sauce \n" + sauce);
    console.log("stringify sauce \n" + JSON.stringify(sauce));*/
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.newSauce = function (req, res) {
  //console.log("text? " + JSON.stringify(req.body));
  //if (req.auth._id != req.body.userId) {
  //  res.status(403).json({ error: "requete non autorisée" });
  //  return;

  const sauceObject = JSON.parse(req.body.sauce);
  console.log("sauceobject " + sauceObject);
  console.log("req.file " + req.file);
  delete sauceObject._id;

  const sauce = new sauceModel({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    usersDisliked: [],
    imageUrl: "http://localhost:3000/" + req.file.filename,
  });

  console.log("sauce " + sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateSauce = function (req, res) {
  let sauce = req.file ? JSON.parse(req.body.sauce) : req.body.sauce;
};

exports.deleteSauce = async function (req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token);
    const userId = decodedToken.userId;
    //console.log("T= " + token + " D= " + decodedToken + " U= " + userId);

    let sauce = await sauceModel.findOne({ _id: req.params.id });
    if (sauce.userId != userId) {
      res.status(403).json({ error: "requete non autorisée" });
      return;
    }
    await sauceModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "sauce supprimée" });
    //console.log(sauce);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.setLike = async function (req, res) {
  try {
    let choice = req.body.like;
    console.log(choice);
    if (!(choice == -1 || choice == 0 || choice == 1)) {
      res.status(400).json({ error: "choix like dislike non valide" });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token);
    const userId = decodedToken.userId;
    if (userId != req.body.userId)
      return res.status(403).json({ error: "requete non autorisée" });
    let sauce = await sauceModel.findOne({ _id: req.params.id });

    if (userId != sauce.userId)
      return res.status(403).json({ error: "requete non autorisée" });
    //console.log(sauce);
    //console.log(req.body.userId);
    //console.log(sauce.usersLiked);
    let like = sauce.usersLiked.indexOf(req.body.userId);

    let dislike = sauce.usersDisliked.indexOf(req.body.userId);
    //console.log(like + " d " + dislike);
    if (like != -1 && choice != 1) {
      console.log("change like");
      await sauceModel.updateOne(
        { _id: req.params.id },
        {
          ...req.body,
          likes: sauce.likes - 1,
          //usersLiked: sauce.usersLiked.splice(like, 1),
          $pull: { usersLiked: req.body.userId },
        }
      );
      if (choice == -1)
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            dislikes: sauce.dislikes + 1,
            //usersDisliked: sauce.usersDisliked.push(req.body.userId),
            $push: { usersDisliked: req.body.userId },
          }
        );
      console.log(await sauceModel.findOne({ _id: req.params.id }));
      res.status(200).json({ message: "sauce mise a jour" });
      return;
    }
    if (dislike != -1 && choice != -1) {
      console.log("change dislike");
      await sauceModel.updateOne(
        { _id: req.params.id },
        {
          ...req.body,
          dislikes: sauce.dislikes - 1,
          //usersDisliked: sauce.usersDisliked.splice(dislike, 1),
          $pull: { usersDisliked: req.body.userId },
        }
      );
      if (choice == 1)
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            likes: sauce.likes + 1,
            //usersLiked: sauce.usersLiked.push(req.body.userId),
            $push: { usersLiked: req.body.userId },
          }
        );
      console.log(await sauceModel.findOne({ _id: req.params.id }));
      res.status(200).json({ message: "sauce mise a jour" });
      return;
    }
    if (like == -1 && dislike == -1 && choice != 0) {
      console.log("set like/dislike");
      if (choice == 1)
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            likes: sauce.likes + 1,
            //usersLiked: sauce.usersLiked.push(req.body.userId),
            $push: { usersLiked: req.body.userId },
          }
        );
      if (choice == -1)
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            dislikes: sauce.dislikes + 1,
            //usersDisliked: sauce.usersDisliked.push(req.body.userId),
            $push: { usersDisliked: req.body.userId },
          }
        );
      console.log(await sauceModel.findOne({ _id: req.params.id }));
      res.status(200).json({ message: "Like mis a jour" });
      return;
    }
    console.log(await sauceModel.findOne({ _id: req.params.id }));
    res.status(200).json({ message: "pas de changement de Like sauce" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
