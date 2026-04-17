const mongoose = require('mongoose');

const dailyRateSchema = new mongoose.Schema({
  glassType: { type: String, required: true },
  pricePerSqFt: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  unit: { type: String, default: 'per sq.ft' },
  changePercent: { type: Number, default: 0 }, // vs previous day
  date: { type: Date, default: Date.now },
  thickness: String, // e.g. "6mm", "8mm"
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('DailyRate', dailyRateSchema);
