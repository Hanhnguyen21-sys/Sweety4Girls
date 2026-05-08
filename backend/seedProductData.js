import mongoose from "mongoose";

import dotenv from "dotenv";

import Product from "./models/Product.js";

import products from "./seed/products.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Product.deleteMany();

await Product.insertMany(products);

console.log("Products seeded!");

process.exit();