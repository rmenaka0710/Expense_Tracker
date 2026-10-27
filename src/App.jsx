import { useMemo } from 'react';
import BudgetForm from './components/BudgetForm';
import CategoryBreakdown from './components/CategoryBreakdown';
import DashboardSummary from './components/DashboardSummary';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  calculateCategoryTotals,
  calculateRemainingBudget,
  calculateTotalExpenses,
} from './utils/calculations';
import { isValidStoredExpense } from './utils/validation';

const sanitizeBudget = (value) => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0);
const sanitizeExpenses = (value) => (Array.isArray(value) ? value.filter(isValidStoredExpense) : []);

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function App() {
  const [budget, setBudget] = useLocalStorage('expense-tracker:budget', 0, sanitizeBudget);
  const [expenses, setExpenses] = useLocalStorage('expense-tracker:expenses', [], sanitizeExpenses);

  const totalExpenses = useMemo(() => calculateTotalExpenses(expenses), [expenses]);
  const remainingBudget = calculateRemainingBudget(budget, totalExpenses);
  const categoryTotals = useMemo(() => calculateCategoryTotals(expenses), [expenses]);

  // Newest date first; ties keep insertion order (newest added first).
  const sortedExpenses = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date)),
    [expenses],
  );

  function handleAddExpense(expense) {
    setExpenses((prev) => [{ ...expense, id: createId() }, ...prev]);
  }

  function handleDeleteExpense(id) {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Smart Expense Tracker</h1>
          <p className="subtitle">Stay on top of your monthly spending.</p>
        </div>
      </header>

      <main className="container">
        <DashboardSummary
          budget={budget}
          totalExpenses={totalExpenses}
          remainingBudget={remainingBudget}
          expenseCount={expenses.length}
        />

        <div className="layout">
          <div className="column">
            <BudgetForm budget={budget} onUpdateBudget={setBudget} />
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
          <div className="column">
            <CategoryBreakdown categoryTotals={categoryTotals} totalExpenses={totalExpenses} />
            <ExpenseList expenses={sortedExpenses} onDeleteExpense={handleDeleteExpense} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">Data is stored locally in your browser.</div>
      </footer>
    </div>
  );
}

export default App;
