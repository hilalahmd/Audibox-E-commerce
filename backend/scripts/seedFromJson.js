const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Admin = require("../models/adminModel");

dotenv.config();

const parseNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const loadJson = () => {
  const dbPath = path.join(__dirname, "..", "..", "front-end", "db.json");
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw);
};

const seed = async () => {
  await connectDB();
  const data = loadJson();

  await Product.deleteMany({});
  await Order.deleteMany({});
  await Admin.deleteMany({});

  for (const user of data.users || []) {
    const hashedPassword = await bcrypt.hash(String(user.password || ""), 10);
    await User.findOneAndUpdate(
      { email: user.email },
      {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        isBlocked: Boolean(user.isBlocked),
        isOnline: Boolean(user.isOnline),
        wishlist: user.wishlist || [],
        cart: user.cart || [],
      },
      { upsert: true, new: true }
    );
  }

  if ((data.products || []).length > 0) {
    await Product.insertMany(
      data.products.map((p) => ({
        id: p.id,
        productName: p.productName,
        type: p.type,
        price: parseNumber(p.price),
        image: p.image,
        status: p.status,
        brand: p.brand,
        model: p.model,
        rating: parseNumber(p.rating),
        description: p.description,
      }))
    );
  }

  if ((data.orders || []).length > 0) {
    await Order.insertMany(
      data.orders.map((o) => ({
        id: o.id,
        userId: o.userId,
        items: o.items || [],
        total: String(o.total),
        status: o.status || "Ordered",
        date: o.date ? new Date(o.date) : new Date(),
        address: o.address || {},
      }))
    );
  }

  if ((data.admin || []).length > 0) {
    await Admin.insertMany(
      data.admin.map((a) => ({
        email: a.email,
        password: String(a.password),
      }))
    );
  }

  console.log("Seed completed from front-end/db.json");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
