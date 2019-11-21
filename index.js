require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");

// We create the database with the path hidden in the .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// We create the server
const app = express();

// We import the routes
const userRoute = require("./Routes/user");
app.use(userRoute);

//We active express-formidable to get body params from req.fields
app.use(formidable());

// Let's start the server,
app.listen(process.env.PORT, () => console.log("Server started"));
