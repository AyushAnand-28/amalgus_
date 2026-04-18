import { useState, useEffect } from 'react';
import { getServicePartners } from '../utils/api';
import './ServicePartners.css';

const cities = ['All Cities','Mumbai','Delhi','Hyderabad','Bangalore','Chennai','Pune','Ahmedabad'];
const specializations = ['All','Installation','Measurement','Site Survey','Structural Glazing','Fabrication','AMC'];

const renderStars = (r) => Array.from({length:5},(_,i)=><span key={i} className={`star ${i<Math.floor(r)?'':'star-empty'}`}>★</span>);

export default function ServicePartners() {
  const [partners, setPartners] = useState([]);
  const [city, setCity] = useState('All Cities');
  const [spec, setSpec] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};
    if (city !== 'All Cities') params.city = city;
    if (spec !== 'All') params.specialization = spec;
    setLoading(true);
    getServicePartners(params).then(r => setPartners(r.data)).finally(() => setLoading(false));
  }, [city, spec]);

  return (
    <div className="partners-page fade-in">
      <div className="page-hero">
        <div className="container">
          <h1>🔧 Service Partners</h1>
          <p>Verified glass installation professionals, measurement specialists, and structural glazing experts across India.</p>
        </div>
      </div>

      <div className="container partners-container">
        {/* Filters */}
        <div className="partners-filters" id="partners-filter-bar">
          <div className="filter-row">
            <span className="filter-label">City:</span>
            {cities.map(c => (
              <button key={c} className={`filter-chip ${city===c?'active':''}`} onClick={() => setCity(c)} id={`city-${c.toLowerCase().replace(/\s/g,'-')}`}>{c}</button>
            ))}
          </div>
          <div className="filter-row">
            <span className="filter-label">Service:</span>
            {specializations.map(s => (
              <button key={s} className={`filter-chip ${spec===s?'active':''}`} onClick={() => setSpec(s)} id={`spec-${s.toLowerCase()}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner"></div>
        ) : partners.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <h3>No partners found</h3>
            <p>Try a different city or specialization</p>
          </div>
        ) : (
          <div className="partners-grid">
            {partners.map(p => (
              <div key={p._id} className="partner-card card" id={`partner-${p._id}`}>
                <div className="partner-header">
                  <div className="partner-avatar">{p.name.charAt(0)}</div>
                  <div>
                    <div className="partner-name">{p.name}</div>
                    <div className="partner-spec badge badge-accent">{p.specialization}</div>
                  </div>
                  {p.isVerified && <span className="verified-badge" title="Verified Partner">✅</span>}
                </div>

                <div className="partner-meta">
                  <span>📍 {p.city}, {p.state}</span>
                  <span>💼 {p.experience} yrs exp.</span>
                </div>

                <div className="partner-rating">
                  <div className="stars">{renderStars(p.rating)}</div>
                  <span className="rating-val">{p.rating}</span>
                  <span className="rating-count">({p.totalReviews} reviews)</span>
                </div>

                <p className="partner-bio">{p.bio}</p>

                <div className="partner-price">
                  <span>💰 </span><strong>{p.priceRange}</strong>
                </div>

                {p.certifications?.length > 0 && (
                  <div className="partner-certs">
                    {p.certifications.map(c => <span key={c} className="cert-chip">{c}</span>)}
                  </div>
                )}

                <div className="partner-availability" style={{ color: p.availability === 'Available' ? 'var(--success)' : 'var(--warn)' }}>
                  🟢 {p.availability}
                </div>

                <div className="partner-actions">
                  <a href={`tel:${p.phone}`} className="btn btn-navy btn-sm" style={{ flex: 1 }} id={`call-${p._id}`}>📞 Call</a>
                  <a href={`mailto:${p.email}`} className="btn btn-outline btn-sm" style={{ flex: 1 }} id={`email-${p._id}`}>✉️ Email</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
