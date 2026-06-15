const mongoose = require('mongoose');
const Admin = require('../src/models/adminModel');
require('dotenv').config();

const resetPassword = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('❌ Error: MONGO_URI environment variable is not defined.');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully!');

    const email = 'admin@dec.com';
    const newPassword = 'hilal9895';

    let admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (admin) {
      console.log(`Found existing admin account for ${email}. Updating password...`);
      admin.password = newPassword;
      await admin.save();
      console.log(`✅ Success: Password for admin ${email} has been updated and bcrypt-hashed.`);
    } else {
      console.log(`Admin account ${email} not found. Creating a new one...`);
      admin = await Admin.create({
        email: email.toLowerCase(),
        password: newPassword,
        role: 'admin',
        isActive: true
      });
      console.log(`✅ Success: New admin account created with email ${email} and bcrypt-hashed password.`);
    }

    const isMatch = await admin.matchPassword(newPassword);
    console.log(`🔒 Verification: Entered password matches stored hash? ${isMatch ? 'YES' : 'NO'}`);

  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetPassword();