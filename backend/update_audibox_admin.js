const mongoose = require('mongoose');
const Admin = require('./src/models/adminModel');
require('dotenv').config();

async function updateAudiboxAdmin() {
  try {
    // Append database name "audibox" to the connection URI if it's not there.
    let uri = process.env.MONGO_URI;
    if (uri.includes('?')) {
      uri = uri.replace('?', 'audibox?');
    } else {
      uri = uri + '/audibox';
    }
    
    console.log('Connecting to URI:', uri);
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const admins = await Admin.find({});
    console.log('Current Admins in audibox DB:', admins.map(a => ({ id: a._id, email: a.email, role: a.role, isActive: a.isActive })));
    
    if (admins.length === 0) {
      console.log('No admins found in audibox. Creating one.');
      const newAdmin = await Admin.create({
        email: 'admin@dec.com',
        password: 'AudiboxAdmin2026!',
        role: 'admin',
        isActive: true
      });
      console.log('Created admin:', newAdmin.email);
    } else {
      const admin = admins[0];
      admin.password = 'AudiboxAdmin2026!';
      await admin.save();
      console.log(`Updated password for admin: ${admin.email} in audibox DB`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateAudiboxAdmin();
