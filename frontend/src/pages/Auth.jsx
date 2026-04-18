import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const roles = ['homeowner','architect','builder','dealer','vendor'];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'homeowner', phone:'', city:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = isLogin ? await loginUser({ email: form.email, password: form.password }) : await registerUser(form);
      login(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-logo">🏗️ AmalGus</div>
          <h2 className="auth-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>

          {/* Demo credentials */}
          {isLogin && (
            <div className="demo-creds">
              <strong>Demo Accounts:</strong>
              <div>homeowner@demo.com / demo1234</div>
              <div>architect@demo.com / demo1234</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input id="auth-name" name="name" type="text" className="form-input" value={form.name} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input id="auth-email" name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="auth-password" name="password" type="password" className="form-input" value={form.password} onChange={handleChange} required />
            </div>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">I am a...</label>
                  <select id="auth-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
                    {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-row-auth">
                  <div className="form-group">
                    <label className="form-label">Phone (optional)</label>
                    <input id="auth-phone" name="phone" type="tel" className="form-input" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City (optional)</label>
                    <input id="auth-city" name="city" type="text" className="form-input" value={form.city} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="btn btn-navy btn-lg btn-full" disabled={loading} id="auth-submit">
              {loading ? '⏳ Processing...' : isLogin ? '🔐 Sign In' : '✅ Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)} id="auth-toggle">
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
