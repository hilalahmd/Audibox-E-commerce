const mongoose = require('mongoose');
require('dotenv').config();

async function listDbs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB cluster');
    
    const adminDb = mongoose.connection.useDb('admin').db;
    const dbsList = await adminDb.admin().listDatabases();
    console.log('Databases in cluster:');
    
    for (const dbInfo of dbsList.databases) {
      console.log(`- ${dbInfo.name}`);
      const db = mongoose.connection.useDb(dbInfo.name);
      const collections = await db.db.listCollections().toArray();
      const colNames = collections.map(c => c.name);
      console.log(`  Collections: ${colNames.join(', ')}`);
      
      if (colNames.includes('admins')) {
        const adminsCount = await db.model('Admin', new mongoose.Schema({}, { strict: false }), 'admins').countDocuments({});
        console.log(`  Admin docs count in ${dbInfo.name}.admins: ${adminsCount}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listDbs();
