require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
//connexion à la bdd
mongoose.connect(process.env.MONGODB_URI);

//Création du serveur

const app = express();
app.use(formidable());
app.use(cors());

//import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);
const posterRoutes = require("./routes/offer");
app.use(posterRoutes);
const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

app.all("*", (req, res) => {
  res.status(400).json("OUPS!!!! TU NE LA RETROUVERAS JAMAIS CETTE PAGE!!");
});
// Utilisez le port défini dans le fichier .env
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
