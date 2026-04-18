import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getTodayRates, getAlliedProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Home.css';

const categories = [
  { icon: '🪟', label: 'Clear Float', type: 'Clear Float' },
  { icon: '🛡️', label: 'Toughened', type: 'Toughened/Tempered' },
  { icon: '🔗', label: 'Laminated', type: 'Laminated' },
  { icon: '❄️', label: 'IGU / DGU', type: 'Insulated (IGU/DGU)' },
  { icon: '🪞', label: 'Reflective', type: 'Reflective' },
  { icon: '🌿', label: 'Low-E', type: 'Low-E' },
  { icon: '🔇', label: 'Acoustic', type: 'Acoustic' },
  { icon: '⚡', label: 'Smart Glass', type: 'Switchable/Smart' },
  { icon: '🎨', label: 'Back-Painted', type: 'Back-Painted/Lacquered' },
  { icon: '❄️', label: 'Frosted', type: 'Frosted/Etched' },
  { icon: '🔧', label: 'Allied', type: null, path: '/products?category=allied' },
  { icon: '🔒', label: 'Bulletproof', type: 'Bulletproof' },
];

const roles = [
  { id: 'homeowner', label: '🏠 Homeowner', desc: 'Personal projects & home renovation' },
  { id: 'architect', label: '📐 Architect', desc: 'Project specifications & technical data' },
  { id: 'builder', label: '🏗️ Builder', desc: 'Bulk orders & multi-site delivery' },
  { id: 'dealer', label: '🏪 Dealer', desc: 'Trade pricing & factory-direct supply' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [rates, setRates] = useState([]);
  const [allied, setAllied] = useState([]);
  const [role, setRole] = useState(() => localStorage.getItem('amalgus_role') || null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) setShowRoleModal(true);
    Promise.all([
      getProducts({ featured: true, limit: 8 }),
      getTodayRates(),
      getAlliedProducts(),
    ]).then(([fp, rr, ap]) => {
      setFeatured(fp.data);
      setRates(rr.data);
      setAllied(ap.data.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const selectRole = (r) => {
    localStorage.setItem('amalgus_role', r);
    setRole(r);
    setShowRoleModal(false);
  };

  const handleAddToCart = (item) => addItem(item);

  const heroMessages = {
    homeowner: { title: "Find the Perfect Glass for Your Home", sub: "From shower enclosures to windows — explore, estimate, and order with confidence." },
    architect: { title: "Specify Glass Like Never Before", sub: "Technical data sheets, certified specs, and multi-vendor comparison for every glass type." },
    builder: { title: "Bulk Glass Orders, Streamlined", sub: "Factory-direct pricing, multi-site delivery, and daily rate transparency for every project." },
    dealer: { title: "Trade Pricing, Every Day", sub: "Real-time factory rates, wide product range, and direct ordering from verified manufacturers." },
  };
  const hero = heroMessages[role] || { title: "India's Glass Marketplace", sub: "Find, compare, and order glass and allied products — from factories to your project site." };

  return (
    <main className="home-page fade-in">
      {/* Role selector modal */}
      {showRoleModal && (
        <div className="role-overlay" id="role-selector-modal">
          <div className="role-modal">
            <div className="role-modal-header">
              <div className="role-modal-logo">🏗️</div>
              <h2>Welcome to AmalGus</h2>
              <p>World's First B2B2C Glass Marketplace</p>
              <p style={{ marginTop: 8, fontSize: '0.88rem' }}>Tell us who you are for a personalized experience</p>
            </div>
            <div className="role-grid">
              {roles.map(r => (
                <button key={r.id} className="role-card" onClick={() => selectRole(r.id)} id={`role-${r.id}`}>
                  <div className="role-label">{r.label}</div>
                  <div className="role-desc">{r.desc}</div>
                </button>
              ))}
            </div>
            <button className="role-skip" onClick={() => setShowRoleModal(false)}>Skip for now →</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🌏 $150B+ Global Glass Market</span>
              <span className="hero-badge-sep">•</span>
              <span>604+ Glass Companies</span>
              <span className="hero-badge-sep">•</span>
              <span>First Niche Marketplace</span>
            </div>
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-sub">{hero.sub}</p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">🔍 Explore Glass Catalog</Link>
              <Link to="/ai-match" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }} id="hero-ai-btn">🤖 AI Glass Finder</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>40+</strong><span>Glass Types</span></div>
              <div className="hero-stat"><strong>5+</strong><span>Verified Vendors</span></div>
              <div className="hero-stat"><strong>Live</strong><span>Daily Rates</span></div>
              <div className="hero-stat"><strong>8+</strong><span>Installers</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glass-animation">
              <div className="glass-panel g1"></div>
              <div className="glass-panel g2"></div>
              <div className="glass-panel g3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Ticker */}
      {rates.length > 0 && (
        <div className="rate-ticker" id="rate-ticker">
          <div className="rate-ticker-inner">
            {[...rates, ...rates].map((r, i) => (
              <span key={i} className="ticker-item">
                <span>📊 {r.glassType} ({r.thickness})</span>
                <strong>₹{r.pricePerSqFt}/sqft</strong>
                <span className={r.changePercent >= 0 ? 'ticker-up' : 'ticker-down'}>
                  {r.changePercent >= 0 ? '▲' : '▼'} {Math.abs(r.changePercent).toFixed(1)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category grid */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Glass Type</h2>
            <Link to="/products" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="category-grid" id="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.path || `/products?glassType=${encodeURIComponent(cat.type)}`}
                className="category-card"
                id={`cat-${cat.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-label">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Matcher CTA */}
      <section className="home-ai-banner">
        <div className="container">
          <div className="ai-banner-inner">
            <div className="ai-banner-text">
              <span className="badge badge-gold" style={{ marginBottom: 12 }}>🤖 AI-Powered</span>
              <h2>Not Sure Which Glass You Need?</h2>
              <p>Describe your requirement in plain English — our AI will recommend the right glass type, thickness, process, and allied products instantly.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                <Link to="/ai-match" className="btn btn-primary btn-lg" id="ai-banner-btn">Try AI Glass Finder</Link>
                <Link to="/estimate" className="btn btn-outline btn-lg" id="estimate-banner-btn" style={{borderColor:'rgba(255,255,255,0.5)', color:'white'}}>Get Quick Estimate</Link>
              </div>
            </div>
            <div className="ai-banner-examples">
              {[
                '"I need glass for my bathroom shower enclosure"',
                '"Soundproof glass for my office partition"',
                '"Safety railing for my 15th floor balcony"',
                '"Energy-efficient glass for my south-facing facade"',
              ].map((ex, i) => (
                <div key={i} className="ai-example" onClick={() => navigate(`/ai-match?q=${encodeURIComponent(ex.replace(/"/g, ''))}`)} style={{ cursor: 'pointer' }}>
                  <span>💬</span> {ex}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Glass Products</h2>
            <Link to="/products" className="btn btn-ghost btn-sm">See All →</Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 320 }}></div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => (
                <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Allied products */}
      {allied.length > 0 && (
        <section className="home-section home-section-grey">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Allied Products</h2>
                <p style={{ marginTop: 4, color: 'var(--text-muted)' }}>Everything that goes with glass</p>
              </div>
              <Link to="/products?category=allied" className="btn btn-ghost btn-sm">View All Allied →</Link>
            </div>
            <div className="allied-grid">
              {allied.map(p => (
                <Link key={p._id} to={`/products/${p._id}`} className="allied-card card" id={`allied-${p._id}`}>
                  <div className="allied-icon">🔧</div>
                  <div>
                    <div className="allied-category">{p.alliedCategory}</div>
                    <div className="allied-name">{p.name}</div>
                    <div className="allied-desc">{p.description?.slice(0, 80)}...</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Rates CTA */}
      <section className="home-rates-cta">
        <div className="container">
          <div className="rates-cta-inner">
            <div>
              <h2>Today's Glass Rates</h2>
              <p>Daily price updates from verified factories across India. Like a stock ticker for glass.</p>
              <Link to="/rates" className="btn btn-primary" style={{ marginTop: 16 }} id="rates-cta-btn">View Live Rates →</Link>
            </div>
            <div className="rates-preview">
              {rates.slice(0, 5).map((r, i) => (
                <div key={i} className="rate-preview-item">
                  <span className="rate-type">{r.glassType}</span>
                  <span className="rate-price">₹{r.pricePerSqFt}<small>/sqft</small></span>
                  <span className={r.changePercent >= 0 ? 'ticker-up' : 'ticker-down'} style={{ fontSize: '0.8rem' }}>
                    {r.changePercent >= 0 ? '▲' : '▼'} {Math.abs(r.changePercent).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">🏗️ AmalGus</div>
              <p>World's First B2B2C Glass & Allied Products Niche Marketplace</p>
              <p style={{ marginTop: 8, fontSize: '0.8rem' }}>Glass Industry | 25 Years of Expertise</p>
            </div>
            <div>
              <h4>Glass Products</h4>
              <ul className="footer-links">
                <li><Link to="/products?glassType=Toughened/Tempered">Toughened Glass</Link></li>
                <li><Link to="/products?glassType=Laminated">Laminated Glass</Link></li>
                <li><Link to="/products?glassType=Low-E">Low-E Glass</Link></li>
                <li><Link to="/products?glassType=Insulated (IGU/DGU)">IGU / DGU</Link></li>
              </ul>
            </div>
            <div>
              <h4>Services</h4>
              <ul className="footer-links">
                <li><Link to="/ai-match">🤖 AI Glass Finder</Link></li>
                <li><Link to="/estimate">📐 Get Estimate</Link></li>
                <li><Link to="/rates">📊 Daily Rates</Link></li>
                <li><Link to="/service-partners">🔧 Find Installer</Link></li>
              </ul>
            </div>
            <div>
              <h4>Customers</h4>
              <ul className="footer-links">
                <li>Homeowners</li>
                <li>Architects & Designers</li>
                <li>Builders & Developers</li>
                <li>Glass Dealers</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 AmalGus Pvt Ltd. All rights reserved.</p>
            <p>Prices are indicative. Contact vendors for final quotes. GST @18% applicable.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
