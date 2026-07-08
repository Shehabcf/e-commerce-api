const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const recalcTotal = (cart) => {
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const getOrCreateCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ items: [] });
  return cart;
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne().populate("items.product");
  if (!cart) {
    return res.status(200).json({ status: "success", message: "Cart is empty", data: { items: [], totalPrice: 0 } });
  }
  res.status(200).json({ status: "success", message: "Cart fetched", data: cart });
});

exports.addItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));
  if (product.stock < quantity) return next(new AppError("Insufficient stock", 400));

  const cart = await getOrCreateCart();
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  recalcTotal(cart);
  await cart.save();
  res.status(200).json({ status: "success", message: "Item added to cart", data: cart });
});

exports.updateItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) return next(new AppError("Item not found in cart", 404));

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  recalcTotal(cart);
  await cart.save();
  res.status(200).json({ status: "success", message: "Cart updated", data: cart });
});

exports.removeItem = asyncHandler(async (req, res, next) => {
  const cart = await getOrCreateCart();
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  recalcTotal(cart);
  await cart.save();
  res.status(200).json({ status: "success", message: "Item removed", data: cart });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();
  res.status(200).json({ status: "success", message: "Cart cleared", data: cart });
});
