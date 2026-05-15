const Product = require("../../models/productModel");

const getProducts = async (req, res) => {
  try {
    let filter = {};

    // Production-grade filtering for admin and users
    if (req.query.status === "all") {
      // Show all products (Admin view)
    } else if (req.query.status === "disabled" || req.query.isActive === "false") {
      filter.isActive = false;
    } else if (req.query.status === "active" || req.query.isActive === "true") {
      filter.isActive = { $ne: false };
    } else {
      // Default behavior: Only show active products to users
      filter.isActive = { $ne: false };
    }

    if (req.query.q) {
      filter.$or = [
          { productName: { $regex: req.query.q, $options: 'i' } },
          { brand: { $regex: req.query.q, $options: 'i' } },
          { type: { $regex: req.query.q, $options: 'i' } }
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.set('X-Total-Count', total);
    res.set('X-Total-Pages', Math.ceil(total / limit));
    res.set('X-Current-Page', page);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBestsellers = async (_req, res) => {
  try {
    const bestsellers = await Product.find({ status: "Bestseller", isActive: { $ne: false } }).limit(8);

    res.json(
      bestsellers.map((p) => ({
        id: p.id,
        productName: p.productName,
        type: p.type,
        price: p.price,
        image: p.image,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getBestsellers,
};
