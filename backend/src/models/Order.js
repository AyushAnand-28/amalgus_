const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  glassType: String,
  thickness: Number,
  width: Number,
  height: Number,
  quantity: Number,
  pricePerSqFt: Number,
  totalPrice: Number,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  subtotal: Number,
  deliveryCharge: { type: Number, default: 0 },
  gst: Number,
  totalAmount: Number,
  deliveryAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending',
  },
  estimatedDelivery: Date,
  notes: String,
}, { timestamps: true });

// Generate order number before save
// Generate order number before save
orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = 'AG-' + Math.floor(10000 + Math.random() * 90000) + '-' + Date.now().toString().slice(-4);
  }
});

module.exports = mongoose.model('Order', orderSchema);
