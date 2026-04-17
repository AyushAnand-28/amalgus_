const express = require('express');
const router = express.Router();
const { matchGlassRequirement } = require('../ai/matcher');
const Product = require('../models/Product');

// POST /api/ai/match
router.post('/match', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const result = matchGlassRequirement(query);

    // Try to find matching products from DB
    const products = await Product.find({
      glassType: result.recommendation.glassType,
      isActive: true,
    }).limit(4);

    res.json({ ...result, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
