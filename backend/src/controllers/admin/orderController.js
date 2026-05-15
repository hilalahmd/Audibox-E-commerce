const Order = require("../../models/orderModel");


const updateOrder = async (req, res) => {
  try {
    const { status, deliveryDate, cancellationReason } = req.body;
    
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (deliveryDate !== undefined) updateData.deliveryDate = deliveryDate;
    if (cancellationReason !== undefined) updateData.cancellationReason = cancellationReason;

    const order = await Order.findOneAndUpdate({ id: req.params.id }, { $set: updateData }, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateOrder };
