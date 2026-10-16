import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { addToWishlist, removeFromWishlist } from '../../api/services';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useState } from 'react';
import './ProductCard.css';

const PLACEHOLDER = 'https://placehold.co/400x300/1a1a2e/ffffff?text=No+Image';

export default function ProductCard({ product, isWishlisted = false, onWishlistChange }) {
  const { isAuthenticated } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [wishLoading, setWishLoading] = useState(false);

  const availabilityBadge = {
    label: product.lowestPrice ? `From ₹${product.lowestPrice.toLocaleString('en-IN')}` : 'Check Price',
    cls: 'badge-blue',
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to save to wishlist');
      return;
    }
    setWishLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(product._id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id);
        setWishlisted(true);
        toast.success('Added to wishlist ❤️');
      }
      onWishlistChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img-wrap">
        <img
          src={product.images?.[0] || PLACEHOLDER}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <button
          className={`wish-btn ${wishlisted ? 'wished' : ''}`}
          onClick={handleWishlist}
          disabled={wishLoading}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <span className="category-tag">{product.category}</span>
      </div>

      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-card-footer">
          <span className={`badge ${availabilityBadge.cls}`}>
            <FiShoppingBag size={11} /> {availabilityBadge.label}
          </span>
          <span className="view-link">View →</span>
        </div>
      </div>
    </Link>
  );
}
