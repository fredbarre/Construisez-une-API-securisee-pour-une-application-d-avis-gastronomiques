const mongodb = require("../managers/mongoDB");
const fs = require("fs");

const jwt = require("../managers/jwt");
let sauceModel = require("../models/sauceModel");

exports.getSauces = async function (req, res) {
  try {
    //console.log("getSauces");
    let sauces = await sauceModel.find();
    //console.log(sauces);
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

exports.updateSauce = async function (req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token);
  const userId = decodedToken.userId;
  //console.log("T= " + token + " D= " + decodedToken + " U= " + userId);

  //sauce = req.file ? JSON.parse(req.body.sauce) : req.body.sauce;
  //let sauce = await sauceModel.findOne({ _id: req.params.id });

  console.log("req.file" + req.file);
  let sauce;
  if (req.file == undefined) {
    if (req.body.userId != userId) {
      res.status(403).json({ error: "requete non autorisée" });
      return;
    }
    console.log("id " + req.params.id);
    await sauceModel.updateOne(
      { _id: req.params.id },
      {
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        usersDisliked: [],
      }
    );
  } else {
    sauce = JSON.parse(req.body.sauce);
    if (sauce.userId != userId) {
      res.status(403).json({ error: "requete non autorisée" });
      return;
    }

    await sauceModel.updateOne(
      { _id: req.params.id },
      {
        userId: sauce.userId,
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        heat: sauce.heat,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        usersDisliked: [],
        imageUrl: "http://localhost:3000/" + req.file.filename,
      }
    );
  }
  //console.log("sauce " + sauce);
  return res.status(200).json({ message: "sauce mise a jour" });
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
    /*fs.unlink("../images/1660127186008.jpg", (err) => {
      if (err) {
        return res.status(500).send({
          message: "Could not delete the file. " + err,
        });
      }
      return res.status(200).send({
        message: "File is deleted.",
      });
    });*/
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

    //console.log(sauce);
    //console.log(req.body.userId);
    //console.log(sauce.usersLiked);
    let liked = sauce.usersLiked.indexOf(req.body.userId) != -1;

    let disliked = sauce.usersDisliked.indexOf(req.body.userId) != -1;
    console.log("liked= " + liked + " disliked " + disliked);
    if (liked) {
      console.log("remove like");
      await sauceModel.updateOne(
        { _id: req.params.id },
        {
          //...req.body,
          likes: sauce.likes - 1,
          //usersLiked: sauce.usersLiked.splice(like, 1),
          $pull: { usersLiked: req.body.userId },
        }
      );
    }

    if (disliked) {
      console.log("remove dislike");
      await sauceModel.updateOne(
        { _id: req.params.id },
        {
          //...req.body,
          dislikes: sauce.dislikes - 1,
          //usersDisliked: sauce.usersDisliked.splice(dislike, 1),
          $pull: { usersDisliked: req.body.userId },
        }
      );
    }

    if (choice == 1) {
      console.log("add like");
      await sauceModel.updateOne(
        { _id: req.params.id },
        {
          //...req.body,
          likes: sauce.likes + 1,
          //usersLiked: sauce.usersLiked.push(req.body.userId),
          $push: { usersLiked: req.body.userId },
        }
      );
    }

    if (choice == -1) {
      console.log("add dislike");
      await sauceModel.updateOne(
        { _id: req.params.id },
        {
          //...req.body,
          dislikes: sauce.dislikes + 1,
          //usersDisliked: sauce.usersDisliked.push(req.body.userId),
          $push: { usersDisliked: req.body.userId },
        }
      );
    }
    //console.log(await sauceModel.findOne({ _id: req.params.id }));
    res.status(200).json({ message: "Like mis a jour" });
    return;
  } catch (error) {
    res.status(400).json({ error });
  }
};
