const express = require("express");
const { getOrders, createOrder, cancelOrder } = require("../../controllers/user/orderController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/orders", protect, getOrders);

router.post("/orders", protect, createOrder);

router.patch("/orders/:id/cancel", protect, cancelOrder);

module.exports = router;
