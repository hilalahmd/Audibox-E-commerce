const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../../controllers/user/wishlistController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;
