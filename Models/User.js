const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  token: String,
  salt: String,
  hash: String,
  account: Object
});

module.exports = User;
