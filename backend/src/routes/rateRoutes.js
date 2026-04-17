const express = require('express');
const router = express.Router();
const { getTodayRates, getRateHistory } = require('../controllers/rateController');

router.get('/', getTodayRates);
router.get('/history', getRateHistory);

module.exports = router;
