const mongoose = require('mongoose');
const Admin = require('../src/models/adminModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for admin initialization');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createInitialAdmin = async () => {
  try {

    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('Admin account already exists. Skipping initialization.');
      return;
    }

    const adminData = {
      email: process.env.INITIAL_ADMIN_EMAIL || 'admin@audibox.com',
      password: process.env.INITIAL_ADMIN_PASSWORD || 'SecurePass123!',
      role: 'admin',
      isActive: true
    };

    const admin = await Admin.create(adminData);

    console.log('✅ Initial admin account created successfully!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔒 Password: ${adminData.password}`);
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🔑 Role: admin');

  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

const runInit = async () => {
  await connectDB();
  await createInitialAdmin();
  await mongoose.connection.close();
  console.log('Admin initialization complete. Exiting...');
};

runInit();
