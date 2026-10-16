export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  return (
    <div className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹ Prev</button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} style={{ padding: '0 0.3rem', color: 'var(--text-muted)' }}>…</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >{p}</button>
        )
      )}
      <button className="page-btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next ›</button>
    </div>
  );
}
