import { useState, useEffect } from 'react';
import { getTodayRates, getEstimate } from '../utils/api';
import './Estimate.css';

const glassTypes = ['Clear Float','Toughened/Tempered','Laminated','Insulated (IGU/DGU)','Reflective','Low-E','Frosted/Etched','Mirror','Acoustic','Back-Painted/Lacquered','Switchable/Smart'];

export default function Estimate() {
  const [form, setForm] = useState({ glassType: 'Toughened/Tempered', thickness: 8, width: 1200, height: 900, quantity: 5 });
  const [rates, setRates] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getTodayRates().then(r => setRates(r.data)); }, []);

  const selectedRate = rates.find(r => r.glassType === form.glassType);
  const pricePerSqFt = selectedRate?.pricePerSqFt || 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'glassType' ? value : Number(value) }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await getEstimate({
        ...form,
        pricePerSqFt,
        vendorName: selectedRate ? 'Market Average' : 'Indicative',
        deliveryDays: 10,
      });
      setResult(data);
    } catch {
      setError('Could not generate estimate. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Live calc
  const widthFt = form.width / 304.8;
  const heightFt = form.height / 304.8;
  const sqFtPerPanel = widthFt * heightFt;
  const totalSqFt = sqFtPerPanel * form.quantity;
  const liveEstimate = Math.round(totalSqFt * pricePerSqFt * 1.18);

  return (
    <div className="estimate-page fade-in">
      <div className="page-hero">
        <div className="container">
          <h1>📐 Glass Price Estimator</h1>
          <p>Get an instant indicative price for your glass requirement. Enter dimensions in millimeters.</p>
        </div>
      </div>

      <div className="container estimate-container">
        <div className="estimate-grid">
          {/* Form */}
          <div className="estimate-form-panel card" id="estimate-form-panel">
            <h2>Enter Your Requirement</h2>
            <form onSubmit={handleSubmit} className="estimate-form" id="estimate-form">
              <div className="form-group">
                <label className="form-label">Glass Type</label>
                <select name="glassType" className="form-select" value={form.glassType} onChange={handleChange} id="estimate-glass-type">
                  {glassTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Thickness (mm)</label>
                <select name="thickness" className="form-select" value={form.thickness} onChange={handleChange} id="estimate-thickness">
                  {[4,5,6,8,10,12,15].map(t => <option key={t} value={t}>{t}mm</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Width (mm)</label>
                  <input name="width" type="number" className="form-input" value={form.width} onChange={handleChange} min={100} max={5000} id="estimate-width" />
                  <span className="form-hint">{(form.width / 304.8).toFixed(2)} ft</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Height (mm)</label>
                  <input name="height" type="number" className="form-input" value={form.height} onChange={handleChange} min={100} max={5000} id="estimate-height" />
                  <span className="form-hint">{(form.height / 304.8).toFixed(2)} ft</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity (number of panels)</label>
                <input name="quantity" type="number" className="form-input" value={form.quantity} onChange={handleChange} min={1} max={10000} id="estimate-qty" />
              </div>

              {/* Live preview */}
              <div className="live-preview">
                <div className="live-preview-row">
                  <span>Rate Used</span>
                  <strong>₹{pricePerSqFt}/sqft {selectedRate ? '' : '(indicative)'}</strong>
                </div>
                <div className="live-preview-row">
                  <span>Per Panel</span>
                  <strong>{sqFtPerPanel.toFixed(2)} sqft</strong>
                </div>
                <div className="live-preview-row">
                  <span>Total Area</span>
                  <strong>{totalSqFt.toFixed(2)} sqft</strong>
                </div>
                <div className="live-preview-divider"></div>
                <div className="live-preview-row live-total">
                  <span>Est. Total (incl. GST)</span>
                  <strong className="price-lg">₹{liveEstimate.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <button type="submit" className="btn btn-navy btn-lg btn-full" disabled={loading} id="estimate-submit">
                {loading ? '⏳ Calculating...' : '📋 Generate Detailed Estimate'}
              </button>
            </form>

            {error && <div className="estimate-error">{error}</div>}
          </div>

          {/* Result panel */}
          <div className="estimate-result-panel">
            {result ? (
              <div className="result-card card fade-in-up" id="estimate-result">
                <div className="result-header-bar">
                  <h3>Estimate Summary</h3>
                  <span className="badge badge-success">✅ Generated</span>
                </div>

                <div className="result-detail-grid">
                  <div className="result-item"><span>Glass Type</span><strong>{result.glassType}</strong></div>
                  <div className="result-item"><span>Thickness</span><strong>{result.thickness}</strong></div>
                  <div className="result-item"><span>Dimensions</span><strong>{result.dimensions}</strong></div>
                  <div className="result-item"><span>Per Panel Area</span><strong>{result.sqFtPerPanel} sqft</strong></div>
                  <div className="result-item"><span>Total Area</span><strong>{result.totalSqFt} sqft</strong></div>
                  <div className="result-item"><span>Quantity</span><strong>{result.quantity} panels</strong></div>
                </div>

                <div className="divider"></div>

                <div className="result-breakdown">
                  <div className="breakdown-row"><span>Glass Cost</span><span>₹{result.breakdown.subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="breakdown-row"><span>Cutting Waste (8%)</span><span>₹{result.breakdown.wasteAllowance.toLocaleString('en-IN')}</span></div>
                  <div className="breakdown-row"><span>GST @18%</span><span>₹{result.breakdown.gst.toLocaleString('en-IN')}</span></div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-total"><span>Total Estimate</span><span className="price-lg">₹{result.breakdown.total.toLocaleString('en-IN')}</span></div>
                </div>

                <div className="divider"></div>

                <div className="result-notes">
                  <h4>📝 Notes</h4>
                  {result.notes.map((n, i) => <div key={i} className="note-item">• {n}</div>)}
                </div>

                <button className="btn btn-outline btn-full" style={{ marginTop: 20 }} onClick={() => window.print()}>
                  🖨️ Print / Save as PDF
                </button>
              </div>
            ) : (
              <div className="estimate-placeholder">
                <div className="placeholder-icon">📐</div>
                <h3>Your Estimate Will Appear Here</h3>
                <p>Fill in the form and click "Generate Detailed Estimate" to see a full price breakdown with GST and wastage allowance.</p>
                <div className="placeholder-tips">
                  <div className="tip-item">💡 Prices include standard cutting and polished edges</div>
                  <div className="tip-item">💡 8% wastage is industry standard for glass cutting</div>
                  <div className="tip-item">💡 GST @18% is applicable on glass products</div>
                  <div className="tip-item">💡 Measurement precision is critical — 1mm wrong = panel rejected</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
