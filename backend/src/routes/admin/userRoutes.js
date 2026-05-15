const express = require("express");

const { getUsers } = require("../../controllers/admin/userController");
const { protect, requireRole } = require("../../middleware/authMiddleware");

const router = express.Router();


router.get("/users", protect, requireRole('admin'), getUsers);

module.exports = router;
