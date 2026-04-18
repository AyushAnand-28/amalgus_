import { useState, useEffect } from 'react';
import { getTodayRates, getRateHistory } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './DailyRates.css';

const COLORS = ['#2e9cca','#1a3c5e','#e8a020','#1a8a55','#c0392b','#8e44ad','#16a085','#e67e22','#2c3e50','#27ae60'];

export default function DailyRates() {
  const [rates, setRates] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTodayRates(), getRateHistory({ days: 7 })]).then(([r, h]) => {
      setRates(r.data);
      setHistory(h.data);
      if (r.data.length > 0 && !selectedType) setSelectedType(r.data[0].glassType);
    }).finally(() => setLoading(false));
  }, []);

  // Pivot history for chart
  const chartData = (() => {
    const byDate = {};
    history.forEach(r => {
      const date = new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (!byDate[date]) byDate[date] = { date };
      byDate[date][r.glassType] = r.pricePerSqFt;
    });
    return Object.values(byDate);
  })();

  const glassTypes = [...new Set(rates.map(r => r.glassType))];

  return (
    <div className="rates-page fade-in">
      <div className="page-hero">
        <div className="container">
          <h1>📊 Today's Glass Rates</h1>
          <p>Live pricing from verified factories across India — updated daily at 9:00 AM. Like a stock ticker for glass.</p>
          <div className="rates-date-badge">🗓️ {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div className="container rates-container">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {/* Live rates grid */}
            <div className="rates-grid" id="rates-grid">
              {rates.map((r, i) => (
                <div
                  key={i}
                  className={`rate-card card ${selectedType === r.glassType ? 'rate-card-active' : ''}`}
                  onClick={() => setSelectedType(r.glassType)}
                  id={`rate-${r.glassType.replace(/[^a-z]/gi,'').toLowerCase()}`}
                >
                  <div className="rate-card-type">{r.glassType}</div>
                  <div className="rate-card-thickness">{r.thickness}</div>
                  <div className="rate-card-price">₹{r.pricePerSqFt}<span>/sqft</span></div>
                  <div className={`rate-card-change ${r.changePercent >= 0 ? 'up' : 'down'}`}>
                    {r.changePercent >= 0 ? '▲' : '▼'} {Math.abs(r.changePercent).toFixed(1)}% today
                  </div>
                </div>
              ))}
            </div>

            {/* 7-Day chart */}
            {chartData.length > 0 && (
              <div className="rates-chart-section">
                <h2>7-Day Price Trend</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Compare price movements across glass types over the last week</p>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={380}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                      <Tooltip formatter={(v, name) => [`₹${v}/sqft`, name]} />
                      <Legend />
                      {glassTypes.slice(0, 5).map((type, i) => (
                        <Line key={type} type="monotone" dataKey={type} stroke={COLORS[i % COLORS.length]} strokeWidth={selectedType===type?3:1.5} dot={false} activeDot={{ r: 4 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Info note */}
            <div className="rates-disclaimer">
              <strong>ℹ️ Note:</strong> Rates shown are indicative market prices from multiple verified factories. Final prices depend on quantity, size, processing, and location. Contact vendors for exact quotations.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
