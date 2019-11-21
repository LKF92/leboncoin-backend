const express = require("express");
const router = express.Router();

const User = require("../Models/User");

// ----------  CREATE ----------> page for creation of new users
router.post("/user/sign-in", async (req, res) => {
  console.log(req);

  try {
    const newUser = new User({
      username: req.fields.username,
      email: req.fields.email,
      password: req.fields.password
    });
    await newUser.save();
    res.json({ message: "user created successfuly" });
    //     {
    //   message: `new user ${newUser.username}successfully created!`,
    //   id: newUser._id
    // });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      help: "username, email and password are mandatory"
    });
  }
});
module.exports = router;
