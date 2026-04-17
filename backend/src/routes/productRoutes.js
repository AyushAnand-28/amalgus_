const express = require('express');
const router = express.Router();
const { getProducts, searchProducts, getProductById, getAlliedProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/allied', getAlliedProducts);
router.get('/:id', getProductById);

module.exports = router;
