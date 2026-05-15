const Order = require("../../models/orderModel");

const getOrders = async (req, res) => {
  try {
    const filter = {};
    const userRole = req.user?.role || 'user';
    if (['admin'].includes(userRole)) {
      if (req.query.userId) {
        filter.userId = req.query.userId;
      }
      if (req.query.search) {
        const regex = new RegExp(req.query.search, 'i');
        filter.$or = [
          { id: regex },
          { 'address.firstName': regex },
          { 'address.lastName': regex },
          { 'address.city': regex }
        ];
        if (req.query.search.length === 24) {
          filter.$or.push({ _id: req.query.search });
        }
      }
    } else {
      filter.userId = req.user._id.toString();
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.set('X-Total-Count', total);
    res.set('X-Total-Pages', Math.ceil(total / limit));
    res.set('X-Current-Page', page);
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    // 1. ATOMIC DECREMENT STOCK (ACID emulation for standalone MongoDB)
    const Product = require("../../models/productModel");
    const successfulDecrements = [];

    if (req.body.items && req.body.items.length > 0) {
      for (const item of req.body.items) {
        // Atomically find and update ONLY if stock is sufficient
        const updatedProduct = await Product.findOneAndUpdate(
          { id: item.id || item._id, stockCount: { $gte: item.quantity || 1 } },
          { $inc: { stockCount: -(item.quantity || 1) } },
          { new: true }
        );

        if (!updatedProduct) {
          // ROLLBACK: Insufficient stock for this item, refund stock for previously succeeded items
          for (const rollbackItem of successfulDecrements) {
            await Product.findOneAndUpdate(
              { id: rollbackItem.id || rollbackItem._id },
              { $inc: { stockCount: rollbackItem.quantity || 1 } }
            );
          }
          return res.status(400).json({ message: `Sorry, currently the product ${item.productName || 'is'} is out of stock` });
        } else {
          successfulDecrements.push(item);
        }
      }
    }
    // 2. CREATE ORDER
    const order = await Order.create(req.body);

    // 3. REMOVE FROM WISHLIST AND CART (Optimized using $pull query instead of loop)
    if (req.body.userId && req.body.items && req.body.items.length > 0) {
      const User = require("../../models/userModel");
      const orderedItemIds = req.body.items.map(item => item.id || item._id);
      
      await User.findByIdAndUpdate(req.body.userId, {
        $pull: { 
          wishlist: { 
            $or: [
              { id: { $in: orderedItemIds } },
              { productId: { $in: orderedItemIds } }
            ]
          },
          cart: { 
            productId: { $in: orderedItemIds } 
          }
        }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findOne({ id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const userRole = req.user?.role || 'user';
    if (!['admin'].includes(userRole) && order.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to cancel this order" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel a delivered order" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // REFUND STOCK (Optimized using MongoDB bulkWrite)
    if (order.items && order.items.length > 0) {
      const Product = require("../../models/productModel");
      const bulkOps = order.items.map(item => ({
        updateOne: {
          filter: { id: item.id || item._id },
          update: { $inc: { stockCount: (item.quantity || 1) } }
        }
      }));
      await Product.bulkWrite(bulkOps);
    }

    order.status = "Cancelled";
    order.cancellationReason = cancellationReason || "No reason provided";

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOrders, createOrder, cancelOrder };
