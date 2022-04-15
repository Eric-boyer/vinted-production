const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const app = express();
const formidableMiddleware = require("express-formidable");
app.use(formidableMiddleware());

const Offer = require("../models/Offer");

const isAuthenticated = require("../Middleware/isAuthenticated");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  console.log(req.fields);

  try {
    const newOffer = new Offer({
      product_name: req.fields.name,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { marque: req.fields.marque },
        { taille: req.fields.taille },
        { etat: req.fields.etat },
        { couleur: req.fields.couleur },
        { ville: req.fields.ville },
      ],
      account: { username: req.fields.username },
      owner: req.user,
    });
    const pictureToUpload = req.files.image.path;
    const result = await cloudinary.uploader.upload(pictureToUpload, {
      folder: "vinted/offer",
      public_id: `${req.fields.name} - ${newOffer._id}`,
    });
    newOffer.product_image = result.secure_url;

    await newOffer.save();
    //   const start = await cloudinary.uploader.upload(req.files.picture.path, {
    // folder: "vinted/offer",
    //     public_id: `${req.fields.title} - ${newOffer._id}`,
    //   });

    res.json({ message: "offer created", offer: newOffer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
