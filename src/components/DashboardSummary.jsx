import { calculateBudgetUsage, formatCurrency } from '../utils/calculations';

function DashboardSummary({ budget, totalExpenses, remainingBudget, expenseCount }) {
  const usage = calculateBudgetUsage(budget, totalExpenses);
  const overBudget = remainingBudget < 0;
  const level = overBudget ? 'danger' : usage >= 80 ? 'warning' : 'ok';

  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="visually-hidden">
        Budget summary
      </h2>
      <div className="stat-grid">
        <div className="stat card">
          <p className="stat-label">Monthly budget</p>
          <p className="stat-value">{formatCurrency(budget)}</p>
          <p className="stat-note">{budget > 0 ? 'This month' : 'Not set yet'}</p>
        </div>
        <div className="stat card">
          <p className="stat-label">Total expenses</p>
          <p className="stat-value">{formatCurrency(totalExpenses)}</p>
          <p className="stat-note">
            {expenseCount} {expenseCount === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>
        <div className={`stat card stat-${level}`}>
          <p className="stat-label">Remaining budget</p>
          <p className="stat-value">{formatCurrency(remainingBudget)}</p>
          <p className="stat-note">{overBudget ? 'Over budget' : 'Available to spend'}</p>
        </div>
      </div>

      <div className="card usage">
        <div className="usage-header">
          <span id="usage-label">Budget used</span>
          <span>{usage.toFixed(0)}%</span>
        </div>
        <div
          className={`progress progress-${level}`}
          role="progressbar"
          aria-labelledby="usage-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(usage)}
        >
          <div className="progress-bar" style={{ width: `${usage}%` }} />
        </div>
      </div>
    </section>
  );
}

export default DashboardSummary;
