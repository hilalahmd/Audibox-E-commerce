const mongoose = require('mongoose');
const Admin = require('./src/models/adminModel');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  
  const admin = await Admin.findOne({ email: 'admin@dec.com' });
  if (admin) {
    admin.password = 'password123';
    await admin.save();
    console.log('Admin password updated to password123');
  } else {
    console.log('Admin not found');
  }
  process.exit(0);
}

createAdmin();
