require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/category.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");

const seedData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    const categories = await Category.insertMany([
      { name: "Electronics", description: "Electronic devices", slug: "electronics" },
      { name: "Clothing", description: "Fashion items", slug: "clothing" },
      { name: "Books", description: "Books and literature", slug: "books" },
    ]);

    const products = await Product.insertMany([
      { name: "Laptop", description: "Gaming laptop", price: 15000, stock: 10, category: categories[0]._id, inStock: true },
      { name: "Smartphone", description: "Android phone", price: 8000, stock: 15, category: categories[0]._id, inStock: true },
      { name: "T-Shirt", description: "Cotton shirt", price: 250, stock: 50, category: categories[1]._id, inStock: true },
      { name: "Jeans", description: "Denim jeans", price: 450, stock: 30, category: categories[1]._id, inStock: true },
      { name: "Novel", description: "Fiction book", price: 120, stock: 40, category: categories[2]._id, inStock: true },
      { name: "Textbook", description: "Educational book", price: 300, stock: 20, category: categories[2]._id, inStock: true },
    ]);

    console.log(`Seeding complete: ${categories.length} categories, ${products.length} products added`);
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedData();
