const express = require("express");
const { loginAdmin, refreshAdminAccessToken, createAdmin, getAdminProfile } = require("../../controllers/admin/adminAuthController");
const { protect, requireRole } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/refresh", refreshAdminAccessToken);
router.post("/create", protect, requireRole('admin'), createAdmin);

router.get("/profile", protect, requireRole('admin'), getAdminProfile);

module.exports = router;
