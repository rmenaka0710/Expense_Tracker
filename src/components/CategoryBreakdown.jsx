import { formatCurrency } from '../utils/calculations';

function CategoryBreakdown({ categoryTotals, totalExpenses }) {
  return (
    <section className="card" aria-labelledby="category-heading">
      <h2 id="category-heading">Spending by category</h2>
      {categoryTotals.length === 0 ? (
        <p className="empty">No spending recorded yet.</p>
      ) : (
        <ul className="category-list">
          {categoryTotals.map(({ category, total }) => {
            const share = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
            const slug = category.toLowerCase();
            return (
              <li key={category} className="category-item">
                <div className="category-row">
                  <span className={`badge badge-${slug}`}>{category}</span>
                  <span className="category-total">
                    {formatCurrency(total)} <span className="muted">({share.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="category-bar" aria-hidden="true">
                  <div className={`category-bar-fill fill-${slug}`} style={{ width: `${share}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CategoryBreakdown;
