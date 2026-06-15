const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');
  
  const hash = await bcrypt.hash('hilal9895', 12);
  
  await mongoose.connection.collection('admins').updateOne(
    { email: 'admin@dec.com' },
    { $set: { password: hash } }
  );
  
  console.log('✅ Password forcefully updated!');
  
  const admin = await mongoose.connection.collection('admins').findOne({ email: 'admin@dec.com' });
  const match = await bcrypt.compare('hilal9895', admin.password);
  console.log('🔒 Verification:', match ? 'YES ✅' : 'NO ❌');
  
  await mongoose.disconnect();
}

fix();