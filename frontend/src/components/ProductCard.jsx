import { useState } from 'react';
import { Link } from 'react-router-dom';

const glassTypes = ['Clear Float', 'Toughened/Tempered', 'Laminated', 'Low-E', 'Reflective', 'Frosted/Etched', 'Mirror', 'Acoustic'];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < Math.floor(rating) ? '' : 'star-empty'}`}>★</span>
  ));
};

export default function ProductCard({ product, onAddToCart }) {
  const bestVendor = product.vendorListings?.reduce((min, v) => (!min || v.pricePerSqFt < min.pricePerSqFt) ? v : min, null);
  const maxRating = product.vendorListings?.reduce((max, v) => v.rating > max ? v.rating : max, 0);

  const fallbackImage = 'https://placehold.co/600x400/f3f4f6/6b7280?text=AmalGus+Glass';

  return (
    <div className="product-card card" id={`product-${product._id}`}>
      {/* Badge */}
      <div className="product-card-badges">
        {product.isFeatured && <span className="badge badge-gold">Featured</span>}
        {product.category === 'allied' && <span className="badge badge-accent">Allied</span>}
      </div>

      {/* Image */}
      <Link to={`/products/${product._id}`} className="product-card-img-wrap">
        <div className="product-card-img" style={{ padding: 0, overflow: 'hidden' }}>
          <img 
            src={product.image || fallbackImage} 
            alt={product.name} 
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImage; }} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />
        </div>
      </Link>

      {/* Info */}
      <div className="product-card-body">
        <div className="product-glass-type">
          <span className="badge badge-glass">{product.glassType}</span>
        </div>

        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {product.thickness?.length > 0 && (
          <div className="product-thickness">
            {product.thickness.slice(0, 4).map(t => (
              <span key={t} className="thickness-chip">{t}mm</span>
            ))}
          </div>
        )}

        {product.application?.length > 0 && (
          <div className="product-apps">
            {product.application.slice(0, 3).map(a => (
              <span key={a} className="app-tag">{a}</span>
            ))}
          </div>
        )}

        {/* Rating */}
        {maxRating > 0 && (
          <div className="product-rating flex items-center gap-8" style={{ marginTop: 6 }}>
            <div className="stars">{renderStars(maxRating)}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({product.vendorListings?.length} vendors)</span>
          </div>
        )}

        {/* Price */}
        <div className="product-price-row">
          {bestVendor ? (
            <>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From </span>
              <span className="price">₹{bestVendor.pricePerSqFt}/sqft</span>
            </>
          ) : (
            <span className="price-sm">Price on Request</span>
          )}
        </div>

        {bestVendor && (
          <div className="product-vendor">
            <span>📦 {bestVendor.vendorName}</span>
            <span>🚚 {bestVendor.deliveryDays}d</span>
          </div>
        )}

        {/* Actions */}
        <div className="product-actions">
          <Link to={`/products/${product._id}`} className="btn btn-navy btn-sm" style={{ flex: 1 }} id={`view-${product._id}`}>
            View Details
          </Link>
          {bestVendor && onAddToCart && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onAddToCart({ ...product, selectedVendorId: bestVendor.vendorId, pricePerSqFt: bestVendor.pricePerSqFt, selectedThickness: product.thickness?.[0] })}
              id={`add-cart-${product._id}`}
            >
              + Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
