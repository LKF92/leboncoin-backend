const express = require("express");
const router = express.Router();
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const User = require("../Models/User");
const Offer = require("../Models/Offer");

// ----------  CREATE ----------> page for creation of new users
router.post("/user/sign-in", async (req, res) => {
  try {
    const token = uid2(64);
    const salt = uid2(64);
    const hash = SHA256(req.fields.password + salt).toString(encBase64);
    const newUser = new User({
      email: req.fields.email,
      token: token,
      salt: salt,
      hash: hash,
      account: {
        username: req.fields.username
      }
    });
    await newUser.save(err => {
      if (err) {
        return next(err.message);
      } else {
        return res.json({
          _id: newUser._id,
          token: newUser.token,
          account: newUser.account
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      help: "username, email and password are mandatory"
    });
  }
});

// ----------  READ ----------> page for login
router.post("/user/login", async (req, res) => {
  try {
    User.findOne({ email: req.fields.email }).exec((err, user) => {
      if (err) {
        return next(err.message);
      }
      if (user) {
        if (SHA256(req.fields.password + user.salt).toString(encBase64) === user.hash) {
          return res.json({
            _id: user._id,
            token: user.token,
            account: user.account
          });
        } else {
          return res.status(401).json({ error: "Unauthorized" });
        }
      } else {
        return next("User not found");
      }
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
module.exports = router;
