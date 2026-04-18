import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handlePlaceOrder = async () => {
    if (!user) { toast.error('Please login to place an order'); navigate('/auth'); return; }
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const orderItems = items.map(item => ({
        productName: item.name,
        glassType: item.glassType,
        thickness: item.selectedThickness,
        width: item.width || 1000,
        height: item.height || 1000,
        quantity: item.qty,
        pricePerSqFt: item.pricePerSqFt,
        vendorName: item.vendorName,
      }));
      const { data } = await createOrder({ items: orderItems, deliveryAddress: { name: user.name, city: user.city || 'Mumbai' } });
      clearCart();
      toast.success(`Order #${data.orderNumber} placed successfully!`);
      navigate('/orders');
    } catch (err) {
      console.error("Order Place Error:", err.response?.data || err);
      toast.error(`Checkout Failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <h2>Your cart is empty</h2>
            <p>Browse our glass catalog to add products</p>
            <Link to="/products" className="btn btn-navy btn-lg" style={{ marginTop: 20 }}>🔍 Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in">
      <div className="page-hero" style={{ padding: '32px 0' }}>
        <div className="container">
          <h1>🛒 Your Cart ({items.length} items)</h1>
        </div>
      </div>

      <div className="container cart-container">
        <div className="cart-grid">
          {/* Items */}
          <div className="cart-items">
            {items.map((item, idx) => {
              const sqFt = ((item.width || 1000) / 304.8) * ((item.height || 1000) / 304.8);
              const lineTotal = Math.round(sqFt * item.qty * item.pricePerSqFt);
              return (
                <div key={idx} className="cart-item card" id={`cart-item-${idx}`}>
                  <div className="cart-item-icon">🪟</div>
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-meta">
                      <span className="badge badge-glass">{item.glassType}</span>
                      <span>{item.selectedThickness}mm</span>
                      <span>{item.width || 1000}×{item.height || 1000}mm</span>
                    </div>
                    {item.vendorName && <div className="cart-item-vendor">📦 {item.vendorName} · ₹{item.pricePerSqFt}/sqft</div>}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Area: {sqFt.toFixed(2)} sqft/panel</div>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => item.qty > 1 ? updateQty(idx, item.qty - 1) : removeItem(idx)} className="qty-btn">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(idx, item.qty + 1)} className="qty-btn">+</button>
                  </div>
                  <div className="cart-item-price">
                    <strong>₹{lineTotal.toLocaleString('en-IN')}</strong>
                    <button onClick={() => removeItem(idx)} className="remove-btn" id={`remove-${idx}`} title="Remove">✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary card" id="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>GST @18%</span><span>₹{Math.round(gst).toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Delivery</span><span>Calculated at checkout</span></div>
            <div className="summary-divider"></div>
            <div className="summary-total"><span>Total</span><span>₹{Math.round(total).toLocaleString('en-IN')}</span></div>

            <button onClick={handlePlaceOrder} disabled={placing} className="btn btn-primary btn-lg btn-full" style={{ marginTop: 20 }} id="place-order-btn">
              {placing ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>
            <Link to="/products" className="btn btn-ghost btn-full" style={{ marginTop: 12 }}>← Continue Shopping</Link>

            <div className="cart-note">
              ℹ️ Prices are indicative. Final invoice will be shared by vendor after order confirmation.
            </div>

            {/* Allied CTA */}
            <div className="cart-allied-cta">
              <h4>🔧 Don't Forget Allied Products</h4>
              <p>Hardware, sealants, and frames — everything that goes with your glass.</p>
              <Link to="/products?category=allied" className="btn btn-outline btn-sm" style={{ marginTop: 10, width: '100%' }}>Browse Allied Products</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
