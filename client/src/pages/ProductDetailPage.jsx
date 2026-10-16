import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../api/services';
import { addToWishlist, removeFromWishlist } from '../api/services';
import MerchantOfferCard from '../components/products/MerchantOfferCard';
import { Spinner } from '../components/common/Spinner';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { FiHeart, FiArrowLeft, FiTag, FiCpu } from 'react-icons/fi';
import './ProductDetailPage.css';

const PLACEHOLDER = 'https://placehold.co/600x450/1a1a2e/ffffff?text=No+Image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id).then((r) => r.data.data),
    staleTime: 30_000,
  });

  const product = data;
  const offers  = product?.offers || [];
  const lowestPrice = offers.length ? Math.min(...offers.map((o) => o.price)) : null;

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); return; }
    setWishLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(id);
        setWishlisted(true);
        toast.success('Added to wishlist ❤️');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setWishLoading(false);
    }
  };

  if (isLoading) return <Spinner text="Loading product…" />;
  if (isError || !product) return (
    <div className="page container text-center">
      <h2>Product not found</h2>
      <Link to="/" className="btn btn-primary mt-2">← Back to Products</Link>
    </div>
  );

  const specs = product.specifications instanceof Map
    ? [...product.specifications.entries()]
    : Object.entries(product.specifications || {});

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> › <span>{product.category}</span> › <span>{product.brand}</span>
        </div>

        {/* Product top section */}
        <div className="detail-layout">
          {/* Image gallery */}
          <div className="detail-gallery">
            <div className="main-img-wrap">
              <img
                src={product.images?.[selectedImg] || PLACEHOLDER}
                alt={product.name}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="thumb-row">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${i === selectedImg ? 'thumb-active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={img} alt="" onError={(e) => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-brand">by <strong>{product.brand}</strong>{product.model && ` · ${product.model}`}</p>
            <p className="detail-description">{product.description}</p>

            {lowestPrice && (
              <div className="price-banner">
                <span className="price-label">Starting from</span>
                <span className="price-value">₹{lowestPrice.toLocaleString('en-IN')}</span>
                <span className="price-note">across {offers.length} merchant{offers.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            <button
              className={`btn ${wishlisted ? 'btn-primary' : 'btn-outline'} btn-lg`}
              onClick={handleWishlist}
              disabled={wishLoading}
              style={{ marginTop: '1rem', gap: '0.5rem' }}
            >
              <FiHeart fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>
        </div>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="detail-section">
            <h2 className="detail-section-title"><FiCpu /> Specifications</h2>
            <div className="specs-grid">
              {specs.map(([key, val]) => (
                <div key={key} className="spec-row">
                  <span className="spec-key">{key}</span>
                  <span className="spec-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merchant offers */}
        <div className="detail-section">
          <h2 className="detail-section-title"><FiTag /> Compare Merchant Offers</h2>
          {offers.length === 0 ? (
            <p className="text-muted">No offers available currently.</p>
          ) : (
            <div className="offers-list">
              {[...offers].sort((a, b) => a.price - b.price).map((offer, i) => (
                <MerchantOfferCard key={offer._id} offer={offer} isLowest={i === 0} />
              ))}
            </div>
          )}
        </div>

        <Link to="/" className="btn btn-ghost mt-4" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <FiArrowLeft /> Back to Products
        </Link>
      </div>
    </div>
  );
}
