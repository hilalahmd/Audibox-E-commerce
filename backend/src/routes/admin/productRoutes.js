const express = require("express");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  disableProduct,
  enableProduct,
} = require("../../controllers/admin/productController");

const { protect, requireRole } = require("../../middleware/authMiddleware");

const router = express.Router();
router.post("/products", protect, requireRole('admin'), createProduct);


router.put("/products/:id", protect, requireRole('admin'), updateProduct);


router.delete("/products/:id", protect, requireRole('admin'), deleteProduct);


router.patch("/products/:id/disable", protect, requireRole('admin'), disableProduct);


router.patch("/products/:id/enable", protect, requireRole('admin'), enableProduct);

module.exports = router;
