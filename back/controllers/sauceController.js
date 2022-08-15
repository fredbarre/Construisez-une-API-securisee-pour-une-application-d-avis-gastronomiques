const mongodb = require("../managers/mongoDB");
const fsPromises = require("fs").promises;

const env = require("../managers/env");
if (!env.PORT) console.log("PORT should be set in .env");
const { PORT = 3000 } = env;
const jwt = require("../managers/jwt");
let sauceModel = require("../models/sauceModel");
let joischema = require("../managers/joivalidator");

exports.getSauces = async function (req, res) {
  try {
    let sauces = await sauceModel.find();
    res.status(200).json(sauces);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getSauce = async function (req, res) {
  try {
    let sauce = await sauceModel.findOne({ _id: req.params.id });
    res.status(200).json(sauce);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.newSauce = function (req, res) {
  try {
    const sauceObject = JSON.parse(req.body.sauce);

    let { error, value } = joischema.validate({
      name: sauceObject.name,
      manufacturer: sauceObject.manufacturer,
      description: sauceObject.description,
      mainPepper: sauceObject.mainPepper,
    });
    if (error != undefined) throw new Error("error");

    delete sauceObject._id;

    const sauce = new sauceModel({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      userLiked: [],
      usersDisliked: [],
      imageUrl: `http://localhost:${PORT}/` + req.file.filename,
    });

    sauce.save();
    return res.status(201).json({ message: "sauce créé !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateSauce = async function (req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token);
    const userId = decodedToken.userId;

    let sauce;
    if (req.file == undefined) {
      if (req.body.userId != userId) {
        res.status(403).json({ error: "unauthorized request" });
        return;
      }
      let { error, value } = joischema.validate({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
      });

      if (error != undefined) throw new Error("error");

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
        res.status(403).json({ error: "unauthorized request" });
        return;
      }
      let oldsauce = await sauceModel.findOne({ _id: req.params.id });

      let fileLink = oldsauce.imageUrl.split("/");
      let fileName = fileLink[fileLink.length - 1];
      await fsPromises.unlink("images/" + fileName);

      let { error, value } = joischema.validate({
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
      });

      if (error != undefined) throw new Error("error");

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
          imageUrl: `http://localhost:${PORT}/` + req.file.filename,
        }
      );
    }

    return res.status(200).json({ message: "sauce mise a jour" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteSauce = async function (req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token);
    const userId = decodedToken.userId;

    let sauce = await sauceModel.findOne({ _id: req.params.id });
    if (sauce.userId != userId) {
      res.status(403).json({ error: "unauthorized request" });
      return;
    }
    let fileLink = sauce.imageUrl.split("/");
    let fileName = fileLink[fileLink.length - 1];
    await fsPromises.unlink("images/" + fileName);

    await sauceModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "sauce supprimée" });
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
      return res.status(403).json({ error: "unauthorized request" });
    let sauceId = req.params.id;
    let sauce = await sauceModel.findOne({ _id: sauceId });

    let liked = sauce.usersLiked.indexOf(req.body.userId) != -1;

    let disliked = sauce.usersDisliked.indexOf(req.body.userId) != -1;
    console.log("liked= " + liked + " disliked " + disliked);
    if (liked) {
      console.log("remove like");
      await sauceModel.updateOne(
        { _id: sauceId },
        {
          likes: sauce.likes - 1,

          $pull: { usersLiked: req.body.userId },
        }
      );
    }

    if (disliked) {
      console.log("remove dislike");
      await sauceModel.updateOne(
        { _id: sauceId },
        {
          dislikes: sauce.dislikes - 1,

          $pull: { usersDisliked: req.body.userId },
        }
      );
    }

    if (choice == 1) {
      console.log("add like");
      await sauceModel.updateOne(
        { _id: sauceId },
        {
          likes: sauce.likes + 1,

          $push: { usersLiked: req.body.userId },
        }
      );
    }

    if (choice == -1) {
      console.log("add dislike");
      await sauceModel.updateOne(
        { _id: sauceId },
        {
          dislikes: sauce.dislikes + 1,

          $push: { usersDisliked: req.body.userId },
        }
      );
    }

    res.status(200).json({ message: "Like mis a jour" });
    return;
  } catch (error) {
    res.status(400).json({ error });
  }
};
