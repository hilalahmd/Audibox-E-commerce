const Product = require("../../models/productModel");


const createProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      id: req.body?.id || `PROD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productName: req.body?.productName?.trim(),
      type: req.body?.type?.trim(),
      image: req.body?.image?.trim(),
      status: req.body?.status?.trim() || "Budget",
      brand: req.body?.brand?.trim() || "",
      model: req.body?.model?.trim() || "",
      description: req.body?.description?.trim() || "",
      price: Number(req.body?.price),
      rating: Number(req.body?.rating || 0),
      stockCount: Number(req.body?.stockCount || 0),
    };

    if (!payload.productName || !payload.type || !payload.image) {
      return res.status(400).json({ message: "productName, type, and image are required" });
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      return res.status(400).json({ message: "price must be a valid number greater than 0" });
    }

    const product = await Product.create(payload);

    res.status(201).json(product);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Product ID already exists. Please retry." });
    }
    console.error("createProduct error:", err);
    res.status(500).json({ message: err.message || "Failed to create product" });
  }
};


const updateProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.price !== undefined) payload.price = Number(payload.price) || 0;
    if (payload.rating !== undefined) payload.rating = Number(payload.rating) || 0;

    const product = await Product.findOneAndUpdate({ id: req.params.id }, payload, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const disableProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const enableProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { isActive: true },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  disableProduct,
  enableProduct,
};
