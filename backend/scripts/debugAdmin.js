const mongoose = require('mongoose');
const Admin = require('../src/models/adminModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for debugging');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkAdmins = async () => {
  try {
    const admins = await Admin.find({});
    console.log('Found admins:', admins.length);
    for (const admin of admins) {
      console.log('Admin:', {
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        hasPassword: !!admin.password
      });

      const testPasswords = ['SecurePass123!', 'admin123', 'password'];
      for (const testPass of testPasswords) {
        const isMatch = await admin.matchPassword(testPass);
        console.log(`  Password '${testPass}' matches: ${isMatch}`);
      }
    }
  } catch (error) {
    console.error('Error checking admins:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(checkAdmins);
