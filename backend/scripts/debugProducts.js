const mongoose = require('mongoose');
const Product = require('../src/models/productModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for debugging products');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkProducts = async () => {
  try {
    const products = await Product.find({});
    console.log('Found products:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', {
        productName: products[0].productName,
        price: products[0].price,
        type: products[0].type,
        stockCount: products[0].stockCount,
        isActive: products[0].isActive
      });
    }
  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(checkProducts);