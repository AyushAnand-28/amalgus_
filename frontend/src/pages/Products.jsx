import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts, searchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Products.css';

const glassTypes = ['Clear Float','Toughened/Tempered','Laminated','Insulated (IGU/DGU)','Tinted','Reflective','Frosted/Etched','Mirror','Low-E','Acoustic','Back-Painted/Lacquered','Ceramic Printed','Switchable/Smart','Bulletproof','Bent/Curved'];
const applications = ['Window','Facade','Shower','Partition','Railing','Door','Skylight','Interior','Commercial','Railing'];
const thicknessOptions = [4,5,6,8,10,12,15];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    glassType: searchParams.get('glassType') || '',
    category: searchParams.get('category') || '',
    application: searchParams.get('application') || '',
    thickness: '',
  });
  const [sortBy, setSortBy] = useState('featured');
  const { addItem } = useCart();
  const q = searchParams.get('q') || '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data;
        if (q) {
          const res = await searchProducts(q);
          data = res.data;
        } else {
          const params = {};
          if (filters.glassType) params.glassType = filters.glassType;
          if (filters.category) params.category = filters.category;
          if (filters.application) params.application = filters.application;
          if (filters.thickness) params.thickness = filters.thickness;
          const res = await getProducts(params);
          data = res.data;
        }
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, q]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') {
      const pa = a.vendorListings?.[0]?.pricePerSqFt || 9999;
      const pb = b.vendorListings?.[0]?.pricePerSqFt || 9999;
      return pa - pb;
    }
    if (sortBy === 'rating') return (b.vendorListings?.[0]?.rating || 0) - (a.vendorListings?.[0]?.rating || 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }));

  return (
    <div className="products-page">
      {/* Page header */}
      <div className="page-hero">
        <div className="container">
          <h1>{q ? `Search: "${q}"` : filters.glassType || filters.category === 'allied' ? (filters.category === 'allied' ? 'Allied Products' : filters.glassType) : 'All Glass Products'}</h1>
          <p>{products.length} products found · {q ? 'Search results' : 'Browse and filter by type, thickness, and application'}</p>
        </div>
      </div>

      <div className="container">
        <div className="products-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar" id="filter-sidebar">
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ glassType:'',category:'',application:'',thickness:'' }); setSearchParams({}); }}>Clear All</button>
            </div>

            <div className="filter-group">
              <div className="filter-group-title">Glass Type</div>
              {glassTypes.map(t => (
                <label key={t} className="filter-option">
                  <input type="checkbox" checked={filters.glassType === t} onChange={() => setFilter('glassType', t)} />
                  <span>{t}</span>
                </label>
              ))}
              <label className="filter-option">
                <input type="checkbox" checked={filters.category === 'allied'} onChange={() => setFilter('category', 'allied')} />
                <span>Allied Products</span>
              </label>
            </div>

            <div className="filter-group">
              <div className="filter-group-title">Thickness (mm)</div>
              {thicknessOptions.map(t => (
                <label key={t} className="filter-option">
                  <input type="checkbox" checked={filters.thickness === String(t)} onChange={() => setFilter('thickness', String(t))} />
                  <span>{t}mm</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-group-title">Application</div>
              {applications.map(a => (
                <label key={a} className="filter-option">
                  <input type="checkbox" checked={filters.application === a} onChange={() => setFilter('application', a)} />
                  <span>{a}</span>
                </label>
              ))}
            </div>

            <div className="sidebar-ai-cta">
              <div>🤖 Not sure which glass?</div>
              <Link to="/ai-match" className="btn btn-accent btn-sm" style={{ marginTop: 8, width: '100%' }}>Use AI Finder</Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="products-main">
            <div className="products-topbar">
              <span className="results-count">{products.length} results</span>
              <div className="sort-bar">
                <label htmlFor="sort-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</label>
                <select id="sort-select" className="form-select" style={{ width: 'auto', padding: '6px 10px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 340, borderRadius: 10 }}></div>)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem' }}>🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <Link to="/ai-match" className="btn btn-accent" style={{ marginTop: 16 }}>Use AI Finder Instead</Link>
              </div>
            ) : (
              <div className="products-grid">
                {sorted.map(p => <ProductCard key={p._id} product={p} onAddToCart={item => addItem(item)} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
