import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../api/services';
import useAuthStore from '../store/authStore';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import './AuthPage.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🛒</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Login to your DealBridge account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <FiMail size={14} /> Email address
            </label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required autoComplete="email"
              className="form-input" placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiLock size={14} /> Password
            </label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} required autoComplete="current-password"
              className="form-input" placeholder="Your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg auth-submit">
            {loading ? <span className="auth-spinner" /> : <FiLogIn size={18} />}
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="auth-demo">
          <p className="auth-demo-title">Demo accounts</p>
          <div className="auth-demo-grid">
            <button className="demo-btn" onClick={() => setForm({ email: 'admin@dealbridge.com', password: 'Admin@123' })}>
              👑 Admin
            </button>
            <button className="demo-btn" onClick={() => setForm({ email: 'user@dealbridge.com', password: 'User@1234' })}>
              👤 User
            </button>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
