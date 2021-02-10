const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.disable("x-powered-by");
app.use(formidableMiddleware());
let corsOptions = {
  origin: process.env.FRONT_WEB_SITE
};

const usersRoute = require("./routes/users");
const offersRoute = require("./routes/offers");
const paymentRoute = require("./routes/payment");

app.use(cors(corsOptions), usersRoute, offersRoute, paymentRoute);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.all("*", (req, res) => {
  res.status(400).json({ message: "not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
