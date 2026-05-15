const mongoose = require('mongoose');
const Admin = require('../src/models/adminModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for password reset');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const resetAdminPassword = async () => {
  try {
    const admin = await Admin.findOne({ email: 'admin@dec.com' });
    if (!admin) {
      console.log('Admin not found');
      return;
    }

    admin.password = 'SecurePass123!';
    await admin.save();

    console.log('✅ Admin password reset successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔒 New Password: SecurePass123!`);

  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(resetAdminPassword);
