const mongoose = require('mongoose');
const User = require('../src/models/userModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for debugging users');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkUsers = async () => {
  try {
    const users = await User.find({});
    console.log('Found users:', users.length);
    if (users.length > 0) {
      console.log('Sample user:', {
        username: users[0].username,
        email: users[0].email,
        isBlocked: users[0].isBlocked
      });
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(checkUsers);