const express = require("express");

const {
  getProducts,
  getBestsellers,
} = require("../../controllers/user/productController");

const router = express.Router();

router.get("/products", getProducts);

router.get("/bestsellers", getBestsellers);

module.exports = router;
