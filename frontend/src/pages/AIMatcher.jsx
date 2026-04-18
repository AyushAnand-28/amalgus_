import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { matchGlass, getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './AIMatcher.css';

const examples = [
  "I need glass for my bathroom shower enclosure",
  "Soundproof glass for my office cabin partition",
  "Safety railing glass for my 8th floor balcony",
  "Sky-lit roof with glass — what type should I use?",
  "Glass for my kitchen wardrobe — colorful and modern",
  "Energy-efficient glass for south-facing commercial facade",
];

export default function AIMatcher() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const textareaRef = useRef();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setQuery(q); handleMatch(q); }
  }, []);

  const handleMatch = async (q) => {
    const qry = q || query;
    if (!qry.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await matchGlass(qry);
      setResult(data);
    } catch {
      setError('Could not reach the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); handleMatch(); };

  return (
    <div className="ai-page fade-in">
      <div className="page-hero">
        <div className="container">
          <div className="ai-hero-badge">🤖 AI Glass Finder</div>
          <h1>Describe Your Requirement</h1>
          <p>Tell us what you're building in plain English — our AI will recommend the right glass type, thickness, process, and allied products.</p>
        </div>
      </div>

      <div className="container ai-container">
        {/* Search form */}
        <form className="ai-form" onSubmit={handleSubmit} id="ai-matcher-form">
          <textarea
            ref={textareaRef}
            id="ai-query-input"
            className="ai-textarea"
            placeholder="e.g. I need glass for my bathroom shower enclosure that is safe and looks elegant..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={4}
          />
          <div className="ai-form-footer">
            <div className="ai-examples-hint">💡 Try: {examples[Math.floor(Math.random() * examples.length)]}</div>
            <button type="submit" className="btn btn-navy btn-lg" disabled={loading} id="ai-submit-btn">
              {loading ? '🔄 Analyzing...' : '🔍 Find My Glass'}
            </button>
          </div>
        </form>

        {/* Example chips */}
        <div className="example-chips">
          {examples.map((ex, i) => (
            <button key={i} className="example-chip" onClick={() => { setQuery(ex); handleMatch(ex); }} id={`example-${i}`}>
              💬 {ex}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="ai-loading">
            <div className="ai-loading-anim">🤖</div>
            <p>Analyzing your requirement against glass specifications...</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="ai-error"><strong>⚠️ {error}</strong></div>}

        {/* Result */}
        {result && !loading && (
          <div className="ai-result fade-in-up">
            {/* Confidence badge */}
            <div className="result-header">
              <div>
                <h2>Our Recommendation</h2>
                <div className="result-query">"{result.query}"</div>
              </div>
              <span className={`badge ${result.confidence==='high'?'badge-success':result.confidence==='medium'?'badge-accent':'badge-glass'}`}>
                {result.confidence === 'high' ? '✅ High Confidence' : result.confidence === 'medium' ? '🟡 Good Match' : '🔵 General'}
              </span>
            </div>

            {/* Main recommendation */}
            <div className="rec-main-card">
              <div className="rec-glass-icon">🪟</div>
              <div className="rec-main-info">
                <div className="rec-label">Recommended Glass Type</div>
                <h3 className="rec-glass-type">{result.recommendation.glassType}</h3>
                <div className="rec-thickness">
                  <span>📏 Thickness: </span>
                  {result.recommendation.thickness?.map(t => <span key={t} className="thickness-chip">{t}mm</span>)}
                </div>
                <div className="rec-process">
                  <span>⚙️ Process: </span>
                  {result.recommendation.process?.join(', ')}
                </div>
                <div className="rec-price-range">
                  💰 Est. Price Range: <strong>{result.recommendation.priceRange}</strong>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="rec-reason">
              <h4>🧠 Why This Glass?</h4>
              <p>{result.recommendation.reason}</p>
            </div>

            {/* Tips */}
            {result.recommendation.tips?.length > 0 && (
              <div className="rec-tips">
                <h4>💡 Industry Tips</h4>
                <ul>
                  {result.recommendation.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}

            {/* Allied products */}
            {result.recommendation.alliedProducts?.length > 0 && (
              <div className="rec-allied">
                <h4>🔧 You'll Also Need</h4>
                <div className="allied-chips">
                  {result.recommendation.alliedProducts.map((a, i) => (
                    <span key={i} className="allied-chip">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Matched products from DB */}
            {result.products?.length > 0 && (
              <div className="rec-products">
                <h4>🛒 Shop These Products</h4>
                <div className="products-grid" style={{ marginTop: 16 }}>
                  {result.products.map(p => <ProductCard key={p._id} product={p} onAddToCart={item => addItem(item)} />)}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rec-cta">
              <Link to={`/products?glassType=${encodeURIComponent(result.recommendation.glassType)}`} className="btn btn-navy btn-lg" id="rec-shop-btn">
                Browse All {result.recommendation.glassType} →
              </Link>
              <Link to="/estimate" className="btn btn-primary btn-lg" id="rec-estimate-btn">
                Get Price Estimate
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
