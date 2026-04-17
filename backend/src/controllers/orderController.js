const Order = require('../models/Order');

// POST /api/orders (protected)
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, notes } = req.body;

    let subtotal = 0;
    const processedItems = items.map(item => {
      const sqFt = ((item.width / 304.8) * (item.height / 304.8));
      const totalPrice = sqFt * item.quantity * item.pricePerSqFt;
      subtotal += totalPrice;
      return { ...item, totalPrice: Math.round(totalPrice) };
    });

    const gst = Math.round(subtotal * 0.18);
    const totalAmount = Math.round(subtotal + gst);

    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      subtotal: Math.round(subtotal),
      gst,
      totalAmount,
      deliveryAddress,
      notes,
      estimatedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id (protected)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
