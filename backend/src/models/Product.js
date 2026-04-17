const mongoose = require('mongoose');

const vendorListingSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  vendorName: String,
  pricePerSqFt: Number,
  minOrderSqFt: Number,
  deliveryDays: Number,
  location: String,
  rating: { type: Number, default: 4.0 },
  inStock: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  glassType: {
    type: String,
    enum: [
      'Clear Float', 'Toughened/Tempered', 'Laminated', 'Insulated (IGU/DGU)',
      'Tinted', 'Reflective', 'Frosted/Etched', 'Mirror', 'Low-E', 'Acoustic',
      'Back-Painted/Lacquered', 'Ceramic Printed', 'Switchable/Smart', 'Bulletproof',
      'Bent/Curved', 'Allied Product'
    ],
    required: true,
  },
  image: { type: String, default: null },
  category: { type: String, enum: ['glass', 'allied'], default: 'glass' },
  thickness: [Number], // mm options e.g. [6, 8, 10, 12]
  process: [String],   // e.g. ['Tempered', 'Laminated', 'Heat Soaked']
  application: [String], // e.g. ['Facade', 'Shower', 'Partition', 'Railing']
  minSize: String,       // e.g. "300x300 mm"
  maxSize: String,       // e.g. "3300x2400 mm"
  images: [String],
  specs: {
    uValue: String,
    shgc: String,
    vlt: String,
    soundReduction: String,
    safetyRating: String,
    certifications: [String],
  },
  vendorListings: [vendorListingSchema],
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  alliedCategory: String, // for allied products: 'Hardware', 'Sealant', etc.
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
