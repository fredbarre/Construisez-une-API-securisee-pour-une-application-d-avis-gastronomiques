const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("./models/user.js");

const DBPASSWORD = process.env.DBPASSWORD;
const hash = require("password-hash");
/*console.log(
  `mongodb+srv://DatabaseUser:${DBPASSWORD}@cluster0.3nenbtk.mongodb.net/test`
);*/
mongoose.connect(
  `mongodb+srv://DatabaseUser:${DBPASSWORD}@cluster0.3nenbtk.mongodb.net/test`,
  function (err) {
    if (err) {
      throw err;
    }
  }
);

//let userModel = mongoose.model("user", userSchema);
let password = "pass";
password = hash.generate(password);
let email = "bob@mail.com";
let user = new userModel({ password: password, email: email });

user.save(function (err) {
  if (err) {
    throw err;
  }
  console.log("utilisateur ajouté avec succès !");
});
/*
app.post("/api/stuff", (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});*/

app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next();
});

app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !");
});
module.exports = app;
