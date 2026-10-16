import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeFromWishlist } from '../api/services';
import ProductCard from '../components/products/ProductCard';
import { Spinner, EmptyState } from '../components/common/Spinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist().then((r) => r.data.data),
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      qc.invalidateQueries(['wishlist']);
      toast.success('Removed from wishlist');
    },
    onError: () => toast.error('Failed to remove'),
  });

  if (isLoading) return <Spinner text="Loading wishlist…" />;
  if (isError)   return (
    <div className="page container text-center">
      <p>⚠️ Failed to load wishlist.</p>
    </div>
  );

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '1.8rem' }}>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiHeart color="var(--primary)" /> My Wishlist
          </h1>
          <p className="section-sub">{data?.length || 0} saved product{data?.length !== 1 ? 's' : ''}</p>
        </div>

        {data?.length === 0 ? (
          <EmptyState
            icon="💔"
            title="Your wishlist is empty"
            message="Browse products and save the ones you love"
            action={<Link to="/" className="btn btn-primary">Browse Products</Link>}
          />
        ) : (
          <div className="product-grid">
            {data.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={true}
                onWishlistChange={() => qc.invalidateQueries(['wishlist'])}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
