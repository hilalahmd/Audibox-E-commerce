const User = require("../../models/userModel")

/* GET CART */

const getCart = async (req, res) => {

  try {

    const userExists = await User.exists({ _id: req.user._id });

    if (!userExists) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const cartItems = await User.aggregate([
      { $match: { _id: req.user._id } },
      { $unwind: "$cart" },
      {
        $lookup: {
          from: "products",
          localField: "cart.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$productDetails", { quantity: "$cart.quantity" }]
          }
        }
      }
    ]);

    res.json(cartItems);  

  }

  catch (err) {

    res.status(500).json({
      message: err.message
    })

  }

}



/* ADD TO CART */

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, "cart.productId": productId },
      { $inc: { "cart.$.quantity": quantity } },
      { new: true }
    );

    if (updatedUser) {
      return res.json(updatedUser.cart);
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { cart: { productId, quantity } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



/* UPDATE QUANTITY */

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, "cart.productId": productId },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or cart item not found" });
    }

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



/* REMOVE ITEM */

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { cart: { productId: productId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



/* CLEAR CART */

const clearCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cart: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



module.exports = {

  getCart,

  addToCart,

  updateCartQuantity,

  removeFromCart,

  clearCart

}