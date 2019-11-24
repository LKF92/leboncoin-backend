const express = require("express");
const router = express.Router();
const Offer = require("../Models/Offer");
const User = require("../Models/User");
const cloudinary = require("cloudinary").v2;

// configurate Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --------------------  CREATE --------------------> Create new Offer
router.post("/offer/create", async (req, res) => {
  try {
    // We check that the user is connected or not(token or not in the header)
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).json({
        error: "Missing authorization header"
      });
      return;
    }
    // We check wether or not the token is a Bearer
    const parts = req.headers.authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        error: "Invalid Authorization Header"
      });
      return;
    }
    // We check if that token is from the authorized user
    const token = parts[1];
    const user = await User.findOne({ token });
    if (!user) {
      res.status(401).json({
        error: "Invalid Token"
      });
      return;
    }
    // If we've found the user, we can create a new offer
    const { title, description, price } = req.fields;
    // We check how many files there is and send an error if there's none
    const pictures = Object.keys(req.files);
    if (pictures.length === 0) {
      res.send("No file uploaded!");
      return;
    }
    // We prepare the Offer with empty files array
    const offer = new Offer({
      title: title,
      price: price,
      description: description,
      creator: user._id,
      files: []
    });

    // We upload each pictures to cloudinary
    const upload2Cloudinary = async () => {
      return Promise.all(
        pictures.map(picture => {
          return cloudinary.uploader.upload(
            //This gives cloudinary the path to the file on the computer
            req.files[picture].path,
            async (error, result) => {
              if (error) {
                res.status(400).json(error.message);
              } else {
                // Save the secure url in the files array
                offer.files = [...offer.files, result.secure_url];
              }
            }
          );
        })
      );
    };
    upload2Cloudinary().then(async data => {
      await offer.save();
    });
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------------  READ --------------------> Display one or more Offer(s)
router.get("/offer/with-count", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json({ count: offers.length, offers: offers });
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
