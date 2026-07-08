const Product = require("../models/product.model");
const Category = require("../models/category.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (inStock !== undefined) filter.inStock = inStock === "true";
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter);
  res.status(200).json({ status: "success", message: "Products fetched", data: products });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category", "name description");
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({ status: "success", message: "Product fetched", data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return next(new AppError("Category not found, cannot create product", 404));

  const product = await Product.create(req.body);
  res.status(201).json({ status: "success", message: "Product created", data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({ status: "success", message: "Product updated", data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  res.status(200).json({ status: "success", message: "Product deleted", data: null });
});
