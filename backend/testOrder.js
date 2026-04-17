const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email: 'homeowner@demo.com', password: 'demo' });
    const token = res.data.token;
    
    const orderRes = await axios.post('http://localhost:5000/api/orders', {
      items: [{
        productName: 'Low-E Coated Glass',
        glassType: 'Low-E',
        thickness: 5,
        width: 1000,
        height: 1000,
        quantity: 1,
        pricePerSqFt: 215,
        vendorName: 'South Asia'
      }],
      deliveryAddress: { name: 'Demo', city: 'Mumbai' }
    }, {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('SUCCESS:', orderRes.data);
  } catch (err) {
    console.error('ERROR MESSAGE:', err.response ? err.response.data : err.message);
  }
})();
