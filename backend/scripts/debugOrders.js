const mongoose = require('mongoose');
const Order = require('../src/models/orderModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for debugging orders');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkOrders = async () => {
  try {
    const orders = await Order.find({});
    console.log('Found orders:', orders.length);
    if (orders.length > 0) {
      console.log('Sample order:', {
        id: orders[0].id,
        userId: orders[0].userId,
        total: orders[0].total,
        status: orders[0].status,
        date: orders[0].date
      });
    }
  } catch (error) {
    console.error('Error checking orders:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(checkOrders);