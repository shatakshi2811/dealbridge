import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../api/services';
import useAuthStore from '../store/authStore';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';
import './AuthPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      setAuth(res.data.user, res.data.token);
      toast.success('Account created! Welcome to DealBridge 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🎉</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join DealBridge and start saving</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label"><FiUser size={14} /> Full name</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} required autoComplete="name"
              className="form-input" placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><FiMail size={14} /> Email address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required autoComplete="email"
              className="form-input" placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><FiLock size={14} /> Password</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} required autoComplete="new-password" minLength={8}
              className="form-input" placeholder="Min 8 chars, 1 uppercase, 1 number"
            />
            <p className="form-hint">Must have ≥8 characters, 1 uppercase letter, and 1 number</p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg auth-submit">
            {loading ? <span className="auth-spinner" /> : <FiUserPlus size={18} />}
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
