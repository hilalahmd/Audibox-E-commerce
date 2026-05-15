const express = require("express")

const {

  getCart,

  addToCart,

  updateCartQuantity,

  removeFromCart,

  clearCart

} = require("../../controllers/user/cartController")

const {
  protect
} = require("../../middleware/authMiddleware")

const router = express.Router()

router.get("/", protect, getCart)

router.post("/", protect, addToCart)

router.put("/:productId",
  protect,
  updateCartQuantity
)

router.delete("/:productId",
  protect,
  removeFromCart
)

router.delete("/",
  protect,
  clearCart
)

module.exports = router