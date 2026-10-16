import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api/services';
import { Spinner } from '../components/common/Spinner';
import { Link } from 'react-router-dom';
import { FiBox, FiShoppingCart, FiMousePointer, FiTrendingUp, FiSettings } from 'react-icons/fi';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => getAnalytics().then((r) => r.data.data),
    refetchInterval: 30_000,
  });

  if (isLoading) return <Spinner text="Loading dashboard…" />;
  if (isError)   return <div className="page container text-center"><p>⚠️ Failed to load analytics.</p></div>;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="section-sub">Real-time platform analytics</p>
          </div>
          <Link to="/admin/products" className="btn btn-primary">
            <FiSettings /> Manage Products
          </Link>
        </div>

        {/* Stat cards */}
        <div className="stats-grid">
          <StatCard icon={<FiBox />}          color="#3b82f6" label="Total Products"  value={data?.totalProducts}  />
          <StatCard icon={<FiShoppingCart />} color="#10b981" label="Merchant Offers" value={data?.totalOffers}    />
          <StatCard icon={<FiMousePointer />} color="#f59e0b" label="Total Clicks"    value={data?.totalClicks}    />
          <StatCard icon={<FiTrendingUp />}   color="#8b5cf6" label="Avg Clicks/Product"
            value={data?.totalProducts ? Math.round((data.totalClicks || 0) / data.totalProducts) : 0}
          />
        </div>

        <div className="analytics-row">
          {/* Top clicked products */}
          <div className="analytics-card">
            <h3>🔥 Most Clicked Products</h3>
            {data?.mostClickedProducts?.length === 0 ? (
              <p className="text-muted" style={{ padding: '1rem 0' }}>No click data yet. Start browsing products!</p>
            ) : (
              <table className="analytics-table">
                <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Clicks</th></tr></thead>
                <tbody>
                  {data?.mostClickedProducts?.map((p, i) => (
                    <tr key={p.productId}>
                      <td><span className="rank-badge">{i + 1}</span></td>
                      <td>
                        <Link to={`/products/${p.productId}`} className="table-link">
                          <strong>{p.name}</strong><br />
                          <small style={{ color: 'var(--text-muted)' }}>{p.brand}</small>
                        </Link>
                      </td>
                      <td><span className="badge badge-blue">{p.category}</span></td>
                      <td><strong>{p.clickCount}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top merchants */}
          <div className="analytics-card">
            <h3>🏪 Top Merchants by Clicks</h3>
            {data?.mostClickedMerchants?.length === 0 ? (
              <p className="text-muted" style={{ padding: '1rem 0' }}>No click data yet.</p>
            ) : (
              <div className="merchant-bars">
                {data?.mostClickedMerchants?.map((m, i) => {
                  const maxClicks = data.mostClickedMerchants[0]?.clickCount || 1;
                  const pct = Math.round((m.clickCount / maxClicks) * 100);
                  return (
                    <div key={m.merchantName} className="merchant-bar-row">
                      <span className="merchant-bar-name">{m.merchantName}</span>
                      <div className="merchant-bar-track">
                        <div className="merchant-bar-fill" style={{ width: `${pct}%`, background: BAR_COLORS[i] }} />
                      </div>
                      <span className="merchant-bar-count">{m.clickCount}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const BAR_COLORS = ['#e94560', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function StatCard({ icon, color, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}22`, color }}>
        {icon}
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value?.toLocaleString('en-IN') ?? '—'}</p>
      </div>
    </div>
  );
}
