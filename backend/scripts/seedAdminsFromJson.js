const mongoose = require('mongoose');
const Admin = require('../src/models/adminModel');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding admins');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedAdmins = async () => {
  try {
    const adminDataPath = path.join(__dirname, '..', '..', 'myShop.admins.json');
    const rawData = fs.readFileSync(adminDataPath, 'utf-8');
    const admins = JSON.parse(rawData);

    for (const admin of admins) {
      // Convert MongoDB extended JSON to plain object
      const adminDoc = {
        _id: admin._id ? admin._id.$oid : undefined,
        email: admin.email,
        password: admin.password, // Already hashed
        role: admin.role,
        isActive: admin.isActive,
        refreshToken: admin.refreshToken,
        createdAt: admin.createdAt ? new Date(admin.createdAt.$date) : new Date(),
        updatedAt: admin.updatedAt ? new Date(admin.updatedAt.$date) : new Date(),
        __v: admin.__v || 0
      };

      // Remove undefined _id if not present
      if (!adminDoc._id) delete adminDoc._id;

      await Admin.findOneAndUpdate(
        { email: adminDoc.email },
        adminDoc,
        { upsert: true, new: true }
      );
      console.log(`Seeded admin: ${adminDoc.email}`);
    }

    console.log('Admin seeding complete');
  } catch (error) {
    console.error('Error seeding admins:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedAdmins();
  await mongoose.connection.close();
  console.log('Seeding complete. Exiting...');
};

runSeed();