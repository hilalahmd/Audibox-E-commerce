const express = require("express");
const { updateOrder } = require("../../controllers/admin/orderController");
const { protect, requireRole } = require("../../middleware/authMiddleware");

const router = express.Router();


router.patch("/orders/:id", protect, requireRole('admin'), updateOrder);

module.exports = router;
