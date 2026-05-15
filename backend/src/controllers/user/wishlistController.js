const User = require("../../models/userModel");
const Product = require("../../models/productModel");

// Get user's wishlist with updated product details
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch latest product details to ensure price and stock are always accurate
    const wishlistItems = user.wishlist || [];
    const productIds = wishlistItems.map(item => item.id || item.productId || item._id).filter(Boolean);
    
    // Safely query both custom 'id' string and MongoDB '_id'
    const validObjectIds = productIds.filter(id => id.length === 24);
    const query = {
      $or: [
        { id: { $in: productIds } },
        { _id: { $in: validObjectIds } }
      ]
    };
    
    const products = await Product.find(query);

    // Ensure we only return wishlist items that still exist in the product DB
    // Optimization: Create a hash map for O(1) lookup to replace the inefficient nested O(N) array .find()
    const productMap = products.reduce((acc, p) => {
      if (p.id) acc[p.id] = p;
      if (p._id) acc[p._id.toString()] = p;
      return acc;
    }, {});

    const updatedWishlist = wishlistItems.map(wishItem => {
      const prodId = String(wishItem.id || wishItem.productId || wishItem._id);
      const freshProduct = productMap[prodId];
      
      if (freshProduct) {
        return freshProduct.toObject();
      }
      return wishItem; // fallback for legacy or deleted products
    }).filter(Boolean);

    res.json(updatedWishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product } = req.body;
    
    if (!product || (!product.id && !product._id)) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    const productId = product.id || product._id;

    // Use $addToSet to avoid duplicates and push a lightweight reference
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        wishlist: {
          productId: productId,
          id: productId // for frontend legacy compatibility
        }
      }
    });

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // $or is NOT valid inside $pull — run two separate $pull operations
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: { id: productId } }
    });
    // Also handle legacy entries that only have productId field
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: { productId: productId } }
    });

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
