require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL, // i.e., https://amalgus.vercel.app
].filter(Boolean);

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow any localhost port (for dev) OR the specific allowed production origins
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/rates', require('./routes/rateRoutes'));
app.use('/api/service-partners', require('./routes/partnerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/estimate', require('./routes/estimateRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'AmalGus API running ✅' }));

app.get('/api/run-seed', (req, res) => {
  const { exec } = require('child_process');
  exec('npm run seed', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error: ${error.message}`);
    }
    res.send(`<h1>Database Seeded Successfully!</h1><pre>${stdout}</pre>`);
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
