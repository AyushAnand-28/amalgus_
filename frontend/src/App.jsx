import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AIMatcher from './pages/AIMatcher';
import DailyRates from './pages/DailyRates';
import Estimate from './pages/Estimate';
import ServicePartners from './pages/ServicePartners';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

import './components/ProductCard.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Inter, sans-serif', fontSize: '0.88rem' },
            }}
          />
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/ai-match" element={<AIMatcher />} />
              <Route path="/rates" element={<DailyRates />} />
              <Route path="/estimate" element={<Estimate />} />
              <Route path="/service-partners" element={<ServicePartners />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
