const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {

    id: { type: String, required: true, unique: true, index: true },

    userId: { type: String, required: true, index: true },

    items: { type: Array, default: [] },

    total: { type: String, required: true },

    status: { type: String, default: "Ordered" },

    date: { type: Date, default: Date.now },

    address: { type: Object, default: {} },

    cancellationReason: { type: String, default: null },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
