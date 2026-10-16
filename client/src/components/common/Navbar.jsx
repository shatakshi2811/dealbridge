import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiLogOut, FiUser, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <FiShoppingBag className="logo-icon" />
          <span>Deal<span className="logo-accent">Bridge</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Products</Link>
          {isAuthenticated && (
            <Link to="/wishlist" className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}>
              <FiHeart size={15} /> Wishlist
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              <FiSettings size={15} /> Admin
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name"><FiUser size={14} /> {user?.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Products</Link>
          {isAuthenticated && (
            <Link to="/wishlist" className="mobile-link" onClick={() => setMenuOpen(false)}>❤️ Wishlist</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>⚙️ Admin</Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="mobile-link mobile-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
