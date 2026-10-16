import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './FilterBar.css';

const CATEGORIES = ['Watches', 'Smartphones', 'Laptops', 'Headphones', 'Fashion', 'Home Appliances'];
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'oldest',     label: 'Oldest First' },
];

export default function FilterBar({ filters, onChange }) {
  const [showFilters, setShowFilters] = useState(false);

  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 });

  const clearAll = () =>
    onChange({ search: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });

  const hasActive =
    filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div className="filter-bar">
      {/* ── Search ── */}
      <div className="search-row">
        <div className="search-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products, brands, models…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
          />
          {filters.search && (
            <button className="search-clear" onClick={() => set('search', '')}><FiX /></button>
          )}
        </div>

        <select
          className="sort-select"
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button
          className={`btn btn-ghost btn-sm filter-toggle ${hasActive ? 'has-filters' : ''}`}
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? 'Hide Filters' : '⚙ Filters'}
          {hasActive && <span className="filter-dot" />}
        </button>

        {hasActive && (
          <button className="btn btn-ghost btn-sm clear-btn" onClick={clearAll}>✕ Clear</button>
        )}
      </div>

      {/* ── Expanded filters ── */}
      {showFilters && (
        <div className="filters-panel">
          {/* Category chips */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="chip-row">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${filters.category === cat ? 'chip-active' : ''}`}
                  onClick={() => set('category', filters.category === cat ? '' : cat)}
                >{cat}</button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="filter-row-inline">
            <div className="filter-group" style={{ flex: 1 }}>
              <label className="filter-label">Min Price (₹)</label>
              <input
                type="number" min="0" placeholder="e.g. 5000"
                className="form-input" value={filters.minPrice}
                onChange={(e) => set('minPrice', e.target.value)}
              />
            </div>
            <div className="filter-group" style={{ flex: 1 }}>
              <label className="filter-label">Max Price (₹)</label>
              <input
                type="number" min="0" placeholder="e.g. 100000"
                className="form-input" value={filters.maxPrice}
                onChange={(e) => set('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Active filter chips ── */}
      {hasActive && (
        <div className="active-filters">
          {filters.search && <span className="active-chip">Search: "{filters.search}" <button onClick={() => set('search', '')}>×</button></span>}
          {filters.category && <span className="active-chip">{filters.category} <button onClick={() => set('category', '')}>×</button></span>}
          {filters.minPrice && <span className="active-chip">Min: ₹{Number(filters.minPrice).toLocaleString('en-IN')} <button onClick={() => set('minPrice', '')}>×</button></span>}
          {filters.maxPrice && <span className="active-chip">Max: ₹{Number(filters.maxPrice).toLocaleString('en-IN')} <button onClick={() => set('maxPrice', '')}>×</button></span>}
        </div>
      )}
    </div>
  );
}
