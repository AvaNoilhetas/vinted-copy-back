const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/user/sign_up", async (req, res) => {
  const { email, password, username, phone } = req.fields;

  try {
    const userFound = await User.findOne({ email: email });

    if (userFound) {
      res.status(409).json("Vous existez déjà ! 🙅‍");
    } else if (!username || !email || !password) {
      res.status(400).json("Vous n'avez pas rentré toutes les données ! 🙅‍");
    } else {
      const salt = uid2(16);
      const hash = SHA256(password + salt).toString(encBase64);
      const token = uid2(16);

      const newUser = new User({
        email: email,
        account: {
          username: username,
          phone: phone
        },
        token: token,
        hash: hash,
        salt: salt
      });

      if (req.files.avatar) {
        const img = await cloudinary.uploader.upload(req.files.avatar.path, {
          folder: `/vinted/users/${newUser._id}`
        });

        newUser.account.avatar = img.secure_url;
      }

      await newUser.save();

      res.status(200).json({
        email: newUser.email,
        account: {
          username: newUser.account.username,
          phone: newUser.account.phone,
          avatar: newUser.account.avatar
        },
        token: newUser.token
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/user/login", async (req, res) => {
  const { email, password } = req.fields;

  try {
    const user = await User.findOne({ email: email });

    if (
      user &&
      SHA256(password + user.salt).toString(encBase64) === user.hash
    ) {
      const userData = {
        _id: user._id,
        token: user.token,
        account: {
          username: user.account.username,
          phone: user.account.phone
        }
      };
      res.status(200).json(userData);
    } else {
      res.status(401).json(`Non autorisé 🙅‍`);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
