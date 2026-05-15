const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {

    id: { type: String, required: true, unique: true, index: true },

    productName: { type: String, required: true },

    type: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },

    image: { type: String, required: true },

    status: { type: String, default: "Budget" },

    brand: { type: String, default: "" },
    model: { type: String, default: "" },

    rating: { type: Number, default: 0 },

    stockCount: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },

    description: { type: String, default: "" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
