import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../api/services';
import useAuthStore from '../store/authStore';

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
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#1a1a2e' }}>Create an Account</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Full Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange} required
            placeholder="John Doe"
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Email</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange} required
            placeholder="you@example.com"
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Password</label>
          <input
            type="password" name="password" value={form.password} onChange={handleChange} required
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: '0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#e94560', fontWeight: '600' }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
