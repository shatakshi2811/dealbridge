import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem 2rem', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.4rem', textDecoration: 'none' }}>
        DealBridge
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Products</Link>
        {isAuthenticated && (
          <Link to="/wishlist" style={{ color: '#fff', textDecoration: 'none' }}>Wishlist</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#ffd700', textDecoration: 'none' }}>Admin</Link>
        )}
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ background: '#e94560', color: '#fff', padding: '0.4rem 1rem', borderRadius: '6px', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
