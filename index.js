require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cors = require("cors");

// We create the database with the path hidden in the .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// We create the server
const app = express();
//We active express-formidable to get body params from req.fields
app.use(formidable());
// app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// We import the routes
const userRoute = require("./Routes/user");
app.use(userRoute);
const offersRoute = require("./Routes/offer");
app.use(offersRoute);

// Let's start the server,
app.listen(process.env.PORT, () => console.log("Server is up !"));
