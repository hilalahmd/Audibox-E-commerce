const mongoose = require("mongoose");
const User = require("../../models/userModel");

const normalizeUser = (userDoc) => {
  const user = userDoc.toObject();
  user.id = user._id.toString();
  
  if (user.lastActive) {
    const isOnlineNow = (new Date() - new Date(user.lastActive)) < 15 * 60 * 1000;
    user.isOnline = user.isOnline && isOnlineNow;
  } else {
    user.isOnline = false;
  }
  
  return user;
};

const getUserById = async (req, res) => {
  try {
    // Authorization check: Users can only access their own data, admins can access any
    const userRole = req.user?.role || 'user';
    if (req.params.id !== req.user._id.toString() && !['admin'].includes(userRole)) {
      return res.status(403).json({ message: "Access denied. You can only view your own profile." });
    }

    // Extract user ID from URL parameters and query the database.
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userRole = req.user?.role || 'user';
    if (req.params.id !== req.user._id.toString() && !['admin'].includes(userRole)) {
      return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

  
    const allowedFields = {};
    if (req.body.username !== undefined) allowedFields.username = req.body.username;
    if (req.body.email !== undefined) allowedFields.email = req.body.email;

    if (['admin'].includes(userRole)) {
      if (req.body.isBlocked !== undefined) {
        if (req.body.isBlocked === true) {
          const Order = require("../../models/orderModel");
          const activeOrders = await Order.find({
            userId: req.params.id,
            status: { $nin: ["Delivered", "Cancelled"] }
          });
          
          if (activeOrders.length > 0) {
            return res.status(400).json({ message: "Cannot block a user with active orders (Processing or Shipped)." });
          }
        }
        allowedFields.isBlocked = req.body.isBlocked;
      }
    }

    // Update user with allowed fields only, returning the updated document.
    const user = await User.findByIdAndUpdate(req.params.id, { $set: allowedFields }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Return normalized user data to maintain frontend compatibility.
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserById, updateUser };
