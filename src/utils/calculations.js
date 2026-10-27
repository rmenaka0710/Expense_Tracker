// Pure calculation helpers. All amounts are plain numbers; formatting happens only at display time.

// Round to whole cents to avoid floating-point drift (e.g. 0.1 + 0.2).
export function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Total expenses = sum of expense amounts.
export function calculateTotalExpenses(expenses) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return roundCurrency(total);
}

// Remaining budget = monthly budget minus total expenses (negative when over budget).
export function calculateRemainingBudget(budget, totalExpenses) {
  return roundCurrency(budget - totalExpenses);
}

// Returns [{ category, total }] sorted by total, highest first.
export function calculateCategoryTotals(expenses) {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([category, total]) => ({ category, total: roundCurrency(total) }))
    .sort((a, b) => b.total - a.total);
}

// Percentage of the budget used, clamped to 0–100 for progress display.
export function calculateBudgetUsage(budget, totalExpenses) {
  if (budget <= 0) return totalExpenses > 0 ? 100 : 0;
  return Math.min(100, Math.max(0, (totalExpenses / budget) * 100));
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}
