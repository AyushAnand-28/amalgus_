import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const statusColors = { pending:'badge-glass', confirmed:'badge-accent', processing:'badge-gold', dispatched:'badge-navy', delivered:'badge-success', cancelled:'badge-danger' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (!user) return (
    <div className="container" style={{ paddingTop: 60 }}>
      <div className="empty-state">
        <h3>Please login to view orders</h3>
        <Link to="/auth" className="btn btn-navy" style={{ marginTop: 16 }}>Login</Link>
      </div>
    </div>
  );

  if (loading) return <div className="container"><div className="spinner"></div></div>;

  if (orders.length === 0) return (
    <div className="orders-page">
      <div className="page-hero"><div className="container"><h1>📋 My Orders</h1></div></div>
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 60 }}>
          <div style={{ fontSize: '3rem' }}>📋</div>
          <h3>No orders yet</h3>
          <p>Your glass orders will appear here once you place them.</p>
          <Link to="/products" className="btn btn-navy" style={{ marginTop: 16 }}>Start Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="orders-page fade-in">
      <div className="page-hero"><div className="container"><h1>📋 My Orders</h1><p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p></div></div>
      <div className="container orders-container">
        {orders.map(order => (
          <div key={order._id} className="order-card card" id={`order-${order._id}`}>
            <div className="order-header">
              <div>
                <div className="order-num">Order #{order.orderNumber}</div>
                <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</div>
              </div>
              <div className="order-header-right">
                <span className={`badge ${statusColors[order.status]}`}>{order.status.toUpperCase()}</span>
                <div className="order-total">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="order-items">
              {order.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span className="order-item-icon">🪟</span>
                  <span className="order-item-name">{item.productName || item.glassType}</span>
                  <span className="order-item-dims">{item.width}×{item.height}mm</span>
                  <span className="order-item-qty">×{item.quantity}</span>
                  <span className="order-item-price">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            {order.estimatedDelivery && (
              <div className="order-delivery">🚚 Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
