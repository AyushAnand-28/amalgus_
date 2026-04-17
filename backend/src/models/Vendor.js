const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  city: { type: String, required: true },
  state: String,
  address: String,
  phone: String,
  email: String,
  logo: String,
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  deliveryDays: { type: Number, default: 7 },
  specializations: [String],
  certifications: [String],
  establishedYear: Number,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
