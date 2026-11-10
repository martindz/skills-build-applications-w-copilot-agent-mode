export default function DataTable({
  columns,
  emptyMessage,
  error,
  loading,
  rows,
  rowKey,
  title,
}) {
  return (
    <section className="card app-card" aria-labelledby={`${title}-heading`}>
      <div className="card-header app-card-header">
        <div>
          <p className="app-card-kicker">OctoFit dashboard</p>
          <h2 className="h3 mb-0" id={`${title}-heading`}>{title}</h2>
        </div>
        <span className="badge rounded-pill text-bg-light">{rows.length} records</span>
      </div>
      <div className="card-body">
        {loading && <p className="app-state" role="status">Loading {title.toLowerCase()}...</p>}
        {error && <p className="alert alert-danger mb-0" role="alert">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="app-state mb-0">{emptyMessage}</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover align-middle app-table mb-0">
              <thead>
                <tr>
                  {columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={rowKey(row, index)}>
                    {columns.map((column) => {
                      const value = column.render
                        ? column.render(row)
                        : row[column.key];
                      return <td key={column.key}>{value ?? '—'}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
