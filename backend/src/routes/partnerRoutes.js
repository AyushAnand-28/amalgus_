const express = require('express');
const router = express.Router();
const { getServicePartners, getPartnerById } = require('../controllers/partnerController');

router.get('/', getServicePartners);
router.get('/:id', getPartnerById);

module.exports = router;
