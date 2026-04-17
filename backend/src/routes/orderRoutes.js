const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getMyOrders).post(protect, createOrder);
router.get('/:id', protect, getOrderById);

module.exports = router;
