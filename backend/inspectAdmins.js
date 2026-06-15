const mongoose = require('mongoose');
const Admin = require('./src/models/adminModel');
require('dotenv').config();

async function inspectAndReset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const admins = await Admin.find({});
    console.log('Current Admins in DB:', admins.map(a => ({ id: a._id, email: a.email, role: a.role, isActive: a.isActive })));
    
    // Choose the target email.
    // If there are admins, we update the first one or admin@audibox.com or admin@dec.com.
    // If there are none, we create admin@audibox.com.
    let targetEmail = 'admin@audibox.com';
    if (admins.length > 0) {
      targetEmail = admins[0].email;
    }
    
    const newPassword = 'AudiboxAdmin2026!';
    
    let admin = await Admin.findOne({ email: targetEmail.toLowerCase() });
    if (admin) {
      admin.password = newPassword;
      await admin.save();
      console.log(`SUCCESS: Updated password for admin: ${targetEmail}`);
    } else {
      admin = await Admin.create({
        email: targetEmail.toLowerCase(),
        password: newPassword,
        role: 'admin',
        isActive: true
      });
      console.log(`SUCCESS: Created new admin: ${targetEmail}`);
    }
    
    console.log(`CREDENTIALS_EMAIL: ${targetEmail}`);
    console.log(`CREDENTIALS_PASSWORD: ${newPassword}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

inspectAndReset();
