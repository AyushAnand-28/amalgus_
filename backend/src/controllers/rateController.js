const DailyRate = require('../models/DailyRate');

// GET /api/rates - Today's rates
const getTodayRates = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rates = await DailyRate.find({ date: { $gte: today } }).sort({ glassType: 1 });
    if (rates.length === 0) {
      // Return most recent rates if today not yet seeded
      const latest = await DailyRate.aggregate([
        { $sort: { date: -1 } },
        { $group: { _id: '$glassType', doc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: { glassType: 1 } },
      ]);
      return res.json(latest);
    }
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rates/history?glassType=&days=7
const getRateHistory = async (req, res) => {
  try {
    const { glassType, days = 7 } = req.query;
    const from = new Date();
    from.setDate(from.getDate() - Number(days));
    const filter = { date: { $gte: from } };
    if (glassType) filter.glassType = glassType;
    const history = await DailyRate.find(filter).sort({ date: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTodayRates, getRateHistory };
