const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Product = require('../src/models/productModel');
const Order = require('../src/models/orderModel');
const Admin = require('../src/models/adminModel');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding all data');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCollection = async (model, fileName, collectionName) => {
  try {
    const filePath = path.join(__dirname, '..', '..', fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`File ${fileName} not found, skipping ${collectionName}`);
      return;
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    await model.deleteMany({});

    for (const item of data) {
      const doc = {};
      for (const [key, value] of Object.entries(item)) {
        if (key === '_id' && value && value.$oid) {
          doc._id = value.$oid;
        } else if ((key === 'createdAt' || key === 'updatedAt' || key === 'date') && value && value.$date) {
          doc[key] = new Date(value.$date);
        } else {
          doc[key] = value;
        }
      }
      if (doc._id) {
        await model.findByIdAndUpdate(doc._id, doc, { upsert: true, new: true });
      } else {
        await model.create(doc);
      }
    }
    console.log(`Seeded ${data.length} ${collectionName}`);
  } catch (error) {
    console.error(`Error seeding ${collectionName}:`, error);
  }
};

const seedAll = async () => {
  await seedCollection(User, 'myShop.users.json', 'users');
  await seedCollection(Product, 'myShop.products.json', 'products');
  await seedCollection(Order, 'myShop.orders.json', 'orders');
  await seedCollection(Admin, 'myShop.admins.json', 'admins');
};

const runSeed = async () => {
  await connectDB();
  await seedAll();
  await mongoose.connection.close();
  console.log('All seeding complete. Exiting...');
};

runSeed();