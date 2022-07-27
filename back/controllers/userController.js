let userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongodb = require("../managers/mongoDB");

exports.signup = async function (req, res) {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new userModel({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = function (req, res) {
  res.send("login placeholder");
};
