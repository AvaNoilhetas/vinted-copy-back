const express = require("express");
const router = express.Router();
const isAuthenticated = require("./../middlewares/isAuthenticated");
const Offer = require("./../models/offers");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/offers", async (req, res) => {
  try {
    let filters = {};

    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }

    if (req.query.priceMin) {
      filters.product_price = {
        $gte: req.query.priceMin
      };
    }

    if (req.query.priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = req.query.priceMax;
      } else {
        filters.product_price = {
          $lte: req.query.priceMax
        };
      }
    }

    let sort = {};

    if (req.query.sort === "price-asc") {
      sort = { product_price: 1 };
    } else if (req.query.sort === "price-desc") {
      sort = { product_price: -1 };
    }

    let page;

    if (Number(req.query.page) < 1) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }

    let limit = Number(req.query.limit);

    const offers = await Offer.find(filters)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: "owner",
        select: "account"
      })
      .select("product_name product_details product_image product_price owner");

    const count = await Offer.countDocuments();

    res.status(200).json({
      result: offers.length,
      count: count,
      offers: offers
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account"
    });
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      city,
      brand,
      size,
      condition,
      color
    } = req.fields;

    if (title || price) {
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { city: city },
          { brand: brand },
          { size: size },
          { condition: condition },
          { color: color }
        ],
        owner: req.user
      });

      const img = await cloudinary.uploader.upload(req.files.image.path, {
        folder: `/vinted/offers/${newOffer._id}`
      });

      newOffer.product_image = img;

      await newOffer.save();

      res.status(200).json(newOffer);
    } else {
      res.status(400).json({ message: "Il manque des trucs ! 🙅‍" });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.put("/offer/update/:id", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      city,
      brand,
      size,
      condition,
      color
    } = req.fields;

    let offer = await Offer.findOne(req.param.id);

    if (title) {
      offer.product_name = title;
    }
    if (description) {
      offer.product_description = description;
    }
    if (price) {
      offer.product_price = price;
    }

    const details = offer.product_details;

    for (let i = 0; i < details.length; i++) {
      if (details[i].brand && brand) {
        details[i].brand = brand;
      } else if (details[i].size && size) {
        details[i].size = size;
      } else if (details[i].condition && condition) {
        details[i].condition = condition;
      } else if (details[i].color && color) {
        details[i].color = color;
      } else if (details[i].city && city) {
        details[i].city = city;
      }
    }

    offer.markModified("product_details");

    if (req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.path, {
        folder: `/vinted/offers/${offer._id}`
      });
      offer.product_image = result;
    }

    await offer.save();

    res.status(200).json("Offer modified succesfully ! 🎉");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    const offer = await Offer.findOne({ _id: req.fields.id });

    await cloudinary.uploader.destroy(offer.product_image.public_id);
    cloudinary.api.delete_folder("vinted/offers/" + req.fields.id);

    await Offer.deleteOne({ _id: req.fields.id });

    res.status(200).json({ message: "C'est supprimé !" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
