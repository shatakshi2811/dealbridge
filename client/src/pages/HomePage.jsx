import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/services';
import ProductCard from '../components/products/ProductCard';
import FilterBar from '../components/products/FilterBar';
import Pagination from '../components/common/Pagination';
import { Spinner, EmptyState } from '../components/common/Spinner';
import { Link } from 'react-router-dom';
import './HomePage.css';

const DEFAULT_FILTERS = {
  search: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1,
};

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleFiltersChange = useCallback((newFilters) => setFilters(newFilters), []);

  const queryParams = {
    ...(filters.search   && { search:   filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.brand    && { brand:    filters.brand }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    sort:  filters.sort,
    page:  filters.page,
    limit: 12,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams).then((r) => r.data),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const products   = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="page">
      {/* ── Hero banner ── */}
      <div className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <span className="hero-tag">🔥 Best Deals Across India</span>
            <h1 className="hero-title">Discover Products.<br />Compare Prices. Save More.</h1>
            <p className="hero-sub">Browse 20+ products from top brands across 6 categories. Find the lowest price across Amazon, Flipkart, Croma, and more.</p>
            <div className="hero-stats">
              <div className="stat-item"><strong>20+</strong><span>Products</span></div>
              <div className="stat-divider" />
              <div className="stat-item"><strong>50+</strong><span>Merchant Offers</span></div>
              <div className="stat-divider" />
              <div className="stat-item"><strong>6</strong><span>Categories</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category quick-links ── */}
      <div className="container">
        <div className="category-strip">
          {['Watches','Smartphones','Laptops','Headphones','Fashion','Home Appliances'].map((cat) => (
            <button
              key={cat}
              className={`category-pill ${filters.category === cat ? 'active' : ''}`}
              onClick={() => setFilters((f) => ({ ...f, category: f.category === cat ? '' : cat, page: 1 }))}
            >
              {catEmoji(cat)} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main listing ── */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <FilterBar filters={filters} onChange={handleFiltersChange} />

        {isLoading ? (
          <Spinner text="Loading products…" />
        ) : isError ? (
          <div className="error-box">
            <p>⚠️ {error?.response?.data?.message || 'Failed to load products.'}</p>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            message="Try adjusting your search or filters"
            action={
              <button className="btn btn-primary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Reset Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="results-meta">
              <span>{pagination?.total} product{pagination?.total !== 1 ? 's' : ''} found</span>
              {pagination && <span>Page {pagination.page} of {pagination.totalPages}</span>}
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination
              page={filters.page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={(p) => { setFilters((f) => ({ ...f, page: p })); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function catEmoji(cat) {
  return { Watches: '⌚', Smartphones: '📱', Laptops: '💻', Headphones: '🎧', Fashion: '👗', 'Home Appliances': '🏠' }[cat] || '📦';
}
