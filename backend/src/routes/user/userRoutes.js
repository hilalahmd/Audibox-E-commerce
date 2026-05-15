const express = require("express");

const { getUserById, updateUser } = require("../../controllers/user/userController");

const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/users/:id", protect, getUserById);

// This is shared role-based. Admin uses it to block, User uses it to update profile.
router.patch("/users/:id", protect, updateUser);

module.exports = router;
