import { formatCurrency } from '../utils/calculations';

// Dates are stored as YYYY-MM-DD; format in UTC so the displayed day never shifts.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function formatDate(dateString) {
  return dateFormatter.format(new Date(`${dateString}T00:00:00Z`));
}

function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <section className="card" aria-labelledby="list-heading">
      <h2 id="list-heading">Transactions</h2>
      {expenses.length === 0 ? (
        <p className="empty">No expenses yet. Add your first one using the form.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-main">
                <p className="expense-title">{expense.title}</p>
                <p className="expense-meta">
                  <span className={`badge badge-${expense.category.toLowerCase()}`}>{expense.category}</span>
                  <time dateTime={expense.date}>{formatDate(expense.date)}</time>
                </p>
              </div>
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => onDeleteExpense(expense.id)}
                aria-label={`Delete ${expense.title}, ${formatCurrency(expense.amount)}`}
                title="Delete"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M9 3h6l1 2h4v2H4V5h4l1-2zm-3 6h12l-1 12H7L6 9zm4 2v8h2v-8h-2zm4 0v8h2v-8h-2z"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ExpenseList;
