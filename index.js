const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(formidableMiddleware());

const usersRoute = require("./routes/users");
const offersRoute = require("./routes/offers");

app.use(usersRoute, offersRoute, cors());

mongoose.connect(process.env.MANGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "not found" });
});

app.listen(3000, () => {
  console.log("Server has started");
});
