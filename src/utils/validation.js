export const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
];

// Accepts a strict YYYY-MM-DD string that represents a real calendar date.
export function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Parses user input into a number; returns NaN for blank or non-numeric input.
export function parseAmount(value) {
  if (typeof value === 'number') return value;
  const trimmed = String(value ?? '').trim();
  if (trimmed === '') return NaN;
  return Number(trimmed);
}

export function validateExpense({ title, amount, category, date }) {
  const errors = {};

  if (!title || title.trim() === '') {
    errors.title = 'Title is required.';
  }

  const numericAmount = parseAmount(amount);
  if (!Number.isFinite(numericAmount)) {
    errors.amount = 'Enter a valid number.';
  } else if (numericAmount <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  if (!CATEGORIES.includes(category)) {
    errors.category = 'Select a category.';
  }

  if (!isValidDateString(date)) {
    errors.date = 'Enter a valid date.';
  }

  return errors;
}

export function validateBudget(value) {
  const numericBudget = parseAmount(value);
  if (!Number.isFinite(numericBudget)) return 'Enter a valid number.';
  if (numericBudget < 0) return 'Budget cannot be negative.';
  return null;
}

// Guards against corrupted or hand-edited localStorage data.
export function isValidStoredExpense(expense) {
  return (
    expense !== null &&
    typeof expense === 'object' &&
    typeof expense.id === 'string' &&
    Object.keys(validateExpense(expense)).length === 0 &&
    typeof expense.amount === 'number'
  );
}
