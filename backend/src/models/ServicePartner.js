const mongoose = require('mongoose');

const servicePartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: {
    type: String,
    enum: ['Installation', 'Measurement', 'Site Survey', 'AMC', 'Fabrication', 'Structural Glazing'],
    required: true,
  },
  city: { type: String, required: true },
  state: String,
  phone: String,
  email: String,
  photo: String,
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  experience: Number, // years
  portfolio: [String], // image URLs
  certifications: [String],
  bio: String,
  priceRange: String, // e.g. "₹50-150/sqft"
  availability: { type: String, default: 'Available' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ServicePartner', servicePartnerSchema);
