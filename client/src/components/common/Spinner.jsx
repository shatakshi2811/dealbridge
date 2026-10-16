export function Spinner({ size = 40, text = 'Loading...' }) {
  return (
    <div className="loading-center">
      <div className="spinner" style={{ width: size, height: size }} />
      {text && <p>{text}</p>}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p style={{ marginBottom: action ? '1.5rem' : 0 }}>{message}</p>}
      {action}
    </div>
  );
}
