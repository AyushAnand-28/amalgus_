const ServicePartner = require('../models/ServicePartner');

// GET /api/service-partners
const getServicePartners = async (req, res) => {
  try {
    const { city, specialization } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (specialization) filter.specialization = specialization;
    const partners = await ServicePartner.find(filter).sort({ rating: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/service-partners/:id
const getPartnerById = async (req, res) => {
  try {
    const partner = await ServicePartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getServicePartners, getPartnerById };
