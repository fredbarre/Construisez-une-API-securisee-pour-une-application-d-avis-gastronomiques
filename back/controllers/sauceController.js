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
  console.log("authid:" + req.auth._id);
  console.log("reqid" + req.body.userId); /*
  if (req.auth._id != req.body.userId) {
    res.status(403).json({ error: "requete non autorisée" });
    return;
  }*/
  /*console.log(req);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObjetct._id;*/
  const sauce = new sauceModel({
    /*...sauceObject,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    usersDisliked: [],*/
    userId: req.body.userId,
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
    let sauce = await sauceModel.findOne({ _id: req.params.id });
    if (req.auth._id != req.body.userId || sauce.userId != req.body.userId) {
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
    /*if (req.auth._id != req.body.userId) {
      res.status(403).json({ error: "requete non autorisée" });
      return;
    }*/

    let choice = req.body.like;
    console.log(choice);
    if (!(choice == -1 || choice == 0 || choice == 1)) {
      res.status(400).json({ error: "choix like dislike non valide" });
      return;
    }
    let sauce = await sauceModel.findOne({ _id: req.params.id });
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
