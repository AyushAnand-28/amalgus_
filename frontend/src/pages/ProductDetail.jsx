import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getAlliedProducts } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const renderStars = (r) => Array.from({length:5},(_,i)=><span key={i} className={`star ${i<Math.floor(r)?'':'star-empty'}`}>★</span>);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [allied, setAllied] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(0);
  const [thickness, setThickness] = useState(null);
  const [qty, setQty] = useState(1);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(900);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([getProductById(id), getAlliedProducts()])
      .then(([pr, ar]) => {
        setProduct(pr.data);
        setThickness(pr.data.thickness?.[0] || null);
        setAllied(ar.data.slice(0, 4));
        setImgError(false); // Reset error state on new product load
      }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 40 }}><div className="spinner"></div></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3><Link to="/products">← Back to Catalog</Link></div>;

  const vendor = product.vendorListings?.[selectedVendor];
  const sqFt = (width / 304.8) * (height / 304.8);
  const estimate = vendor ? Math.round(sqFt * qty * vendor.pricePerSqFt * 1.18) : null;

  const handleAddToCart = () => {
    if (!vendor) return toast.error('Select a vendor first');
    addItem({ ...product, selectedVendorId: vendor.vendorId, vendorName: vendor.vendorName, pricePerSqFt: vendor.pricePerSqFt, selectedThickness: thickness, width, height, qty });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-detail-page fade-in">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> › <Link to="/products">Products</Link> › {product.glassType} › <span>{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="detail-grid">
          {/* Left: Visual */}
          <div className="detail-visual">
            <div className="detail-img-main" style={{ padding: 0 }}>
              <img 
                src={product.image || 'https://placehold.co/800x600/f3f4f6/6b7280?text=AmalGus+Glass'} 
                alt={product.name} 
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/800x600/f3f4f6/6b7280?text=AmalGus+Glass'; }} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'var(--radius-lg)' }} 
              />
            </div>
            {/* Minibar specs */}
            <div className="detail-spec-pills">
              {product.thickness?.map(t => (
                <button key={t} className={`spec-pill ${thickness===t?'active':''}`} onClick={()=>setThickness(t)}>{t}mm</button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="detail-info">
            <h1 className="detail-title">{product.name}</h1>
            <div className="detail-meta">
              <span className="badge badge-glass">{product.glassType}</span>
              {product.application?.slice(0,4).map(a => <span key={a} className="badge badge-success">{a}</span>)}
            </div>
            <p className="detail-desc">{product.description}</p>

            {/* Specs table */}
            {(product.specs?.uValue || product.specs?.soundReduction || product.specs?.safetyRating) && (
              <div className="detail-specs">
                <h4>Technical Specs</h4>
                <table className="spec-table">
                  <tbody>
                    {product.specs.uValue && <tr><td>U-Value</td><td><strong>{product.specs.uValue}</strong></td></tr>}
                    {product.specs.shgc && <tr><td>SHGC</td><td><strong>{product.specs.shgc}</strong></td></tr>}
                    {product.specs.vlt && <tr><td>VLT</td><td><strong>{product.specs.vlt}</strong></td></tr>}
                    {product.specs.soundReduction && <tr><td>Sound Reduction</td><td><strong>{product.specs.soundReduction}</strong></td></tr>}
                    {product.specs.safetyRating && <tr><td>Safety Rating</td><td><strong>{product.specs.safetyRating}</strong></td></tr>}
                    {product.minSize && <tr><td>Min Size</td><td><strong>{product.minSize}</strong></td></tr>}
                    {product.maxSize && <tr><td>Max Size</td><td><strong>{product.maxSize}</strong></td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick estimate */}
            <div className="quick-estimate-box">
              <h4>Quick Price Estimate</h4>
              <div className="estimate-inputs">
                <div className="form-group">
                  <label className="form-label">Width (mm)</label>
                  <input className="form-input" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} min={100} />
                </div>
                <div className="form-group">
                  <label className="form-label">Height (mm)</label>
                  <input className="form-input" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} min={100} />
                </div>
                <div className="form-group">
                  <label className="form-label">Qty (panels)</label>
                  <input className="form-input" type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min={1} />
                </div>
              </div>
              {estimate && (
                <div className="estimate-result">
                  <div>Approx. Total (incl. GST):</div>
                  <div className="price-lg">₹{estimate.toLocaleString('en-IN')}</div>
                  <Link to="/estimate" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>Detailed Estimate →</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vendor comparison */}
        {product.vendorListings?.length > 0 && (
          <div className="vendor-section">
            <h2>Compare Vendors</h2>
            <p className="vendor-hint">Select your preferred vendor below</p>
            <table className="vendor-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Vendor</th>
                  <th>Location</th>
                  <th>Price/sqft</th>
                  <th>Min Order</th>
                  <th>Delivery</th>
                  <th>Rating</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {product.vendorListings.map((v, idx) => (
                  <tr key={idx} className={selectedVendor===idx?'vendor-best':''} onClick={()=>setSelectedVendor(idx)} style={{cursor:'pointer'}}>
                    <td><input type="radio" checked={selectedVendor===idx} onChange={()=>setSelectedVendor(idx)} /></td>
                    <td><strong>{v.vendorName}</strong> {v.inStock ? <span className="badge badge-success">In Stock</span> : <span className="badge badge-danger">Out</span>}</td>
                    <td>{v.location}</td>
                    <td><strong className="price">₹{v.pricePerSqFt}</strong></td>
                    <td>{v.minOrderSqFt} sqft</td>
                    <td>🚚 {v.deliveryDays} days</td>
                    <td><div className="stars">{renderStars(v.rating)}</div> {v.rating}</td>
                    <td><button className="btn btn-accent btn-sm" onClick={e=>{e.stopPropagation();setSelectedVendor(idx);}}>Select</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add to cart */}
        {vendor && (
          <div className="detail-add-cart">
            <div className="add-cart-summary">
              <div>
                <strong>{vendor.vendorName}</strong> · ₹{vendor.pricePerSqFt}/sqft · {vendor.deliveryDays} days
              </div>
              {estimate && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>~₹{estimate.toLocaleString('en-IN')} for {width}×{height}mm × {qty} panels (incl. GST)</div>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} id="add-to-cart-btn">🛒 Add to Cart</button>
              <Link to="/estimate" className="btn btn-outline btn-lg">Get Full Quote</Link>
            </div>
          </div>
        )}

        {/* Allied products */}
        {allied.length > 0 && (
          <div className="allied-section">
            <h2>You'll Also Need</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Allied products that typically go with {product.glassType}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {allied.map(a => (
                <Link key={a._id} to={`/products/${a._id}`} className="allied-card card" style={{ display: 'flex', gap: 16, padding: 16, textDecoration: 'none' }}>
                  <span style={{ fontSize: '1.8rem' }}>🔧</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>{a.alliedCategory}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{a.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
