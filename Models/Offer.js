const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  files: Array,
  created: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = Offer;
