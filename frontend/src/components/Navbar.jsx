import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { searchProducts } from '../utils/api';
import './Navbar.css';

const categories = [
  'All Glass', 'Clear Float', 'Toughened/Tempered', 'Laminated', 'Insulated (IGU/DGU)',
  'Reflective', 'Low-E', 'Frosted/Etched', 'Mirror', 'Acoustic', 'Switchable/Smart',
  'Back-Painted/Lacquered', 'Allied Products',
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Glass');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const { data } = await searchProducts(query);
          setSuggestions(data.slice(0, 6));
          setShowSugg(true);
        } catch { setSuggestions([]); }
      } else {
        setSuggestions([]); setShowSugg(false);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
      setShowSugg(false);
    }
  };

  const handleSuggClick = (product) => {
    navigate(`/products/${product._id}`);
    setQuery(''); setShowSugg(false);
  };

  return (
    <header className="navbar-root" id="site-header">
      {/* Top bar */}
      <div className="navbar-topbar">
        <div className="flex items-center justify-between w-full" style={{ padding: '0 24px' }}>
          <span className="topbar-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img src="https://img.icons8.com/fluency/48/city-buildings.png" alt="building" style={{ width: 16, height: 16 }} />
            World's First B2B2C Glass Marketplace
          </span>
          <div className="topbar-links">
            <Link to="/rates" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img src="https://img.icons8.com/fluency/48/combo-chart.png" alt="rates" style={{ width: 16, height: 16 }} /> Daily Rates
            </Link>
            <Link to="/service-partners" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img src="https://img.icons8.com/fluency/48/worker-male.png" alt="installer" style={{ width: 16, height: 16 }} /> Find Installer
            </Link>
            {user ? (
              <>
                <span className="topbar-user">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={logout} className="topbar-btn">Logout</button>
              </>
            ) : (
              <Link to="/auth">Login / Register</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="navbar-main">
        <div className="container flex items-center justify-between gap-16">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">A</div>
            <div>
              <div className="logo-text">AmalGus</div>
              <div className="logo-sub">Glass Marketplace</div>
            </div>
          </Link>

          {/* Search bar */}
          <form className="search-bar" onSubmit={handleSearch} ref={searchRef}>
            <select
              className="search-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              id="search-category"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              id="search-input"
              className="search-input"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 200)}
              autoComplete="off"
            />
            <button type="submit" className="search-btn" id="search-submit">
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/search--v1.png" alt="Search" style={{ width: 18, height: 18 }} />
            </button>
            {showSugg && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(p => (
                  <div key={p._id} className="suggestion-item" onMouseDown={() => handleSuggClick(p)}>
                    <span className="sugg-icon">
                      <img src="https://img.icons8.com/fluency/48/diamond.png" alt="glass" style={{ width: 16, height: 16 }} />
                    </span>
                    <div>
                      <div className="sugg-name">{p.name}</div>
                      <div className="sugg-type">{p.glassType} · {p.thickness?.join(', ')}mm</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Right side */}
          <div className="navbar-actions">
            <Link to="/ai-match" className="nav-action-btn" id="ai-matcher-nav">
              <span className="action-icon">
                <img src="https://img.icons8.com/fluency/48/bot.png" alt="ai" style={{ width: 28, height: 28 }} />
              </span>
              <div>
                <div className="action-label">AI Match</div>
                <div className="action-sub">Find Glass</div>
              </div>
            </Link>
            {user && (
              <Link to="/orders" className="nav-action-btn" id="orders-nav">
                <span className="action-icon">
                  <img src="https://img.icons8.com/fluency/48/box--v1.png" alt="returns" style={{ width: 26, height: 26 }} />
                </span>
                <div>
                  <div className="action-label">Returns</div>
                  <div className="action-sub">& Orders</div>
                </div>
              </Link>
            )}
            <Link to="/cart" className="nav-cart-btn" id="cart-nav">
              <div className="cart-icon-wrap">
                <span className="cart-icon">
                  <img src="https://img.icons8.com/fluency/48/shopping-cart.png" alt="cart" style={{ width: 28, height: 28 }} />
                </span>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </div>
              <div className="action-sub" style={{fontSize:'0.75rem'}}>Cart</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Category nav bar */}
      <nav className="navbar-categories">
        <div className="container">
          <ul className="cat-nav-list" id="category-nav">
            <li><Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><img src="https://img.icons8.com/ios-filled/50/FFFFFF/menu--v1.png" alt="menu" style={{ width: 14, height: 14 }} /> All</Link></li>
            <li><Link to="/products?glassType=Clear Float">Clear Float</Link></li>
            <li><Link to="/products?glassType=Toughened/Tempered">Toughened</Link></li>
            <li><Link to="/products?glassType=Laminated">Laminated</Link></li>
            <li><Link to="/products?glassType=Insulated (IGU/DGU)">IGU / DGU</Link></li>
            <li><Link to="/products?glassType=Reflective">Reflective</Link></li>
            <li><Link to="/products?glassType=Low-E">Low-E</Link></li>
            <li><Link to="/products?glassType=Frosted/Etched">Frosted</Link></li>
            <li><Link to="/products?glassType=Mirror">Mirror</Link></li>
            <li><Link to="/products?glassType=Acoustic">Acoustic</Link></li>
            <li><Link to="/products?category=allied">Allied Products</Link></li>
            <li><Link to="/service-partners" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><img src="https://img.icons8.com/fluency/48/worker-male.png" alt="installers" style={{ width: 14, height: 14 }} /> Installers</Link></li>
            <li><Link to="/ai-match" className="cat-ai-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><img src="https://img.icons8.com/fluency/48/bot.png" alt="ai" style={{ width: 14, height: 14 }} /> AI Match</Link></li>
            <li><Link to="/estimate" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><img src="https://img.icons8.com/fluency/48/calculator.png" alt="estimate" style={{ width: 14, height: 14 }} /> Estimate</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
