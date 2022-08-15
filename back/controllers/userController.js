let userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongodb = require("../managers/mongoDB");
//const jwt = require("jsonwebtoken");
const jwt = require("../managers/jwt");

let env = require("../managers/env");
if (!env.TOKENSECRET) console.log("TOKENSECRET must be set in .env");
const { TOKENSECRET } = env;
//const TOKENSECRET = process.env.TOKENSECRET;
let joischema = require("../managers/joivalidator");

exports.signup = async function (req, res) {
  try {
    let { error, value } = joischema.validate({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("error");
    console.log(error);
    if (error != undefined) throw new Error("error");
    let hash = await bcrypt.hash(req.body.password, 10);

    const user = new userModel({
      email: req.body.email,
      password: hash,
    });
    user.save(); ///.catch((error) => res.status(400).json({ error }));
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ error });
  }
  /*.catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));*/
};

exports.login = async function (req, res) {
  let user = await userModel
    .findOne({ email: req.body.email })
    .catch((error) => {
      throw res.status(500).json({ error });
    });

  if (!user) {
    return res
      .status(401)
      .json({ message: "Paire login/mot de passe incorrecte" });
  }
  let valid = await bcrypt
    .compare(req.body.password, user.password)
    .catch((error) => {
      throw res.status(500).json({ error });
    });

  if (!valid) {
    return res
      .status(401)
      .json({ message: "Paire login/mot de passe incorrecte" });
  }
  const userId = user._id;

  res.status(200).json({
    userId,
    token: jwt.sign({ userId }),
  });
};
