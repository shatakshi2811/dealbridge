import { FiExternalLink, FiStar } from 'react-icons/fi';
import './MerchantOfferCard.css';

const MERCHANT_COLORS = {
  'Amazon':          { bg: '#fff4e6', accent: '#FF9900', icon: '🛒' },
  'Flipkart':        { bg: '#eff6ff', accent: '#2874f0', icon: '🛍' },
  'Croma':           { bg: '#f0fdf4', accent: '#00a86b', icon: '⚡' },
  'Myntra':          { bg: '#fdf4ff', accent: '#ff3f6c', icon: '👗' },
  'Reliance Digital':{ bg: '#fff1f2', accent: '#e63946', icon: '📱' },
  'Tata CLiQ':       { bg: '#fffbeb', accent: '#d97706', icon: '🏷' },
  'Ajio':            { bg: '#f5f3ff', accent: '#7c3aed', icon: '🎽' },
  'Vijay Sales':     { bg: '#ecfdf5', accent: '#059669', icon: '🔧' },
};

const DEFAULT_MERCHANT = { bg: '#f9fafb', accent: '#374151', icon: '🏪' };

export default function MerchantOfferCard({ offer, isLowest }) {
  const style = MERCHANT_COLORS[offer.merchantName] || DEFAULT_MERCHANT;

  const availBadge = {
    'In Stock':    { cls: 'badge-green',  label: '✓ In Stock' },
    'Out of Stock':{ cls: 'badge-red',    label: '✗ Out of Stock' },
    'Limited':     { cls: 'badge-yellow', label: '⚠ Limited Stock' },
  }[offer.availability] || { cls: 'badge-gray', label: offer.availability };

  const handleClick = () => {
    // The backend /api/redirect/:id handles click tracking + redirect
    const apiUrl = import.meta.env.VITE_API_URL || '';
    window.open(`${apiUrl}/api/redirect/${offer._id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="offer-card" style={{ '--merchant-bg': style.bg, '--merchant-accent': style.accent }}>
      {isLowest && (
        <div className="offer-best-badge">
          <FiStar size={11} /> Best Price
        </div>
      )}

      <div className="offer-merchant">
        <span className="offer-merchant-icon">{style.icon}</span>
        <div>
          <p className="offer-merchant-name">{offer.merchantName}</p>
          <p className="offer-updated">
            Updated {new Date(offer.lastUpdated || offer.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      <div className="offer-right">
        <div className="offer-price-wrap">
          <span className="offer-price">₹{offer.price.toLocaleString('en-IN')}</span>
          <span className={`badge ${availBadge.cls}`}>{availBadge.label}</span>
        </div>
        <button
          className="btn-buy"
          onClick={handleClick}
          disabled={offer.availability === 'Out of Stock'}
        >
          Buy Now <FiExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
