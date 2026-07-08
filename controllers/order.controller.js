const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne().populate("items.product");
  if (!cart || cart.items.length === 0) return next(new AppError("Cart is empty", 400));

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product || product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${item.product.name}`, 400));
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderNumber = `ORD-${Date.now()}`;

  const order = await Order.create({ orderNumber, items: orderItems, totalPrice, shippingAddress });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: "success", message: "Order created", data: order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({ status: "success", message: "Orders fetched", data: orders });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));
  res.status(200).json({ status: "success", message: "Order fetched", data: order });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) return next(new AppError("Order not found", 404));

  res.status(200).json({ status: "success", message: "Order status updated", data: order });
});
