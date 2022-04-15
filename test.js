const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const app = express();
app.use(formidableMiddleware());
mongoose.connect("mongodb://localhost/vinted");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// 1- créer un model de mon Vinted:

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: {
      required: true,
      type: String,
    },
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});
// 2- creer mon user grace à la methode CREATE
app.post("/user/signup", async (req, res) => {
   console.log(req.fields);
// mettre toutes les instructions dans le try
  try {

    // s'assurer avec la methode findOne que l'utulisateur n'existe pas pas si le serveur retourne null on le crée(cette technique permettra de securiser le code)
    const isUsertExisting = await User.findOne({
      account: { username: req.fields.username },
      email: req.fields.email,
    });
    console.log(isUsertExisting);
// ce modèle nous permet de générer un mot de passe
    const password = req.fields.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);
// déclaration d'une nouvelle variable pour créer mon utulisateur
    const newUser = await new User({
      email: req.fields.email,
      account: { username: req.fields.username },
      newsletter: req.fields.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });
// dorénavant favorise cette méthode pour générer un User!! mais ta condition après ta déclaration
    if (isUsertExisting === null) {
        // sauvegarder ensuite la reponse dans la base de données
      newUser.save();
      res.json({
        message: "User created",id: newUser._id,token : newUser.token, account: {account:newUser.account.username}
        
      });
    } else {
      res.json({ message: "l'utulisateur à deja été créee " });
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// 3- cette route permet au User de s'identifier
app.post("/user/login", async (req, res) => {
  try {
// toujours s'assurer par un findOne de son email ou de son Id qu'il existe      
    const user = await User.findOne({ email: req.fields.email });

    const password = req.fields.password;
    const salt = user.salt;
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);
// compare ensuite si le mot de passe saisit par le user et celui dans la base de donnée sont similaire si c'est ook !! 
    if (user.hash === hash) {
      res.json({ message: "everything is ok you can start" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(400).json("OUPS!!!! TU NE LA RETROUVERAS JAMAIS CETTE PAGE!!");
});

app.listen(3001, (req, res) => {
  console.log("server started");
});
