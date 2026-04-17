const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { glassType, category, application, process, thickness, featured, limit = 40 } = req.query;
    const filter = { isActive: true };
    if (glassType) filter.glassType = glassType;
    if (category) filter.category = category;
    if (application) filter.application = { $in: [application] };
    if (process) filter.process = { $in: [process] };
    if (thickness) filter.thickness = { $in: [Number(thickness)] };
    if (featured === 'true') filter.isFeatured = true;

    const products = await Product.find(filter).limit(Number(limit)).sort({ isFeatured: -1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/search?q=
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const products = await Product.find({
      $or: [
        { $text: { $search: q } },
        { name: { $regex: q, $options: 'i' } },
        { glassType: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { application: { $in: [new RegExp(q, 'i')] } },
      ],
      isActive: true,
    }).limit(20);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/allied
const getAlliedProducts = async (req, res) => {
  try {
    const { glassType } = req.query;
    const products = await Product.find({ category: 'allied', isActive: true }).limit(12);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, searchProducts, getProductById, getAlliedProducts };
