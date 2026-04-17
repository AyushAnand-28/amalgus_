const express = require('express');
const router = express.Router();

// POST /api/estimate
router.post('/', (req, res) => {
  try {
    const { glassType, thickness, width, height, quantity, pricePerSqFt, vendorId, vendorName, deliveryDays } = req.body;

    if (!width || !height || !quantity || !pricePerSqFt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert mm to sqft
    const widthFt = width / 304.8;
    const heightFt = height / 304.8;
    const sqFtPerPanel = widthFt * heightFt;
    const totalSqFt = sqFtPerPanel * quantity;
    const subtotal = totalSqFt * pricePerSqFt;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    // Add cutting waste (industry standard ~8%)
    const wasteAllowance = subtotal * 0.08;

    res.json({
      glassType,
      thickness: `${thickness}mm`,
      dimensions: `${width}mm × ${height}mm`,
      sqFtPerPanel: sqFtPerPanel.toFixed(2),
      totalSqFt: totalSqFt.toFixed(2),
      quantity,
      pricePerSqFt,
      vendorId,
      vendorName,
      deliveryDays,
      breakdown: {
        subtotal: Math.round(subtotal),
        wasteAllowance: Math.round(wasteAllowance),
        gst: Math.round(gst),
        total: Math.round(total + wasteAllowance),
      },
      notes: [
        'Prices include standard cutting and polished edges',
        '8% wastage allowance added for precise cutting',
        'GST @18% included',
        'Delivery charges may apply based on location',
        `Estimated delivery: ${deliveryDays || 7} working days`,
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
