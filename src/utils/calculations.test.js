import { describe, expect, it } from 'vitest';
import {
  calculateBudgetUsage,
  calculateCategoryTotals,
  calculateRemainingBudget,
  calculateTotalExpenses,
} from './calculations';
import { isValidDateString, validateBudget, validateExpense } from './validation';

const expenses = [
  { id: '1', title: 'Lunch', amount: 0.1, category: 'Food', date: '2026-10-01' },
  { id: '2', title: 'Snack', amount: 0.2, category: 'Food', date: '2026-10-02' },
  { id: '3', title: 'Bus', amount: 2.5, category: 'Transport', date: '2026-10-03' },
];

describe('calculations', () => {
  it('sums expense amounts without float drift', () => {
    expect(calculateTotalExpenses(expenses)).toBe(2.8);
    expect(calculateTotalExpenses([])).toBe(0);
  });

  it('computes remaining budget, including overspend', () => {
    expect(calculateRemainingBudget(10, 2.8)).toBe(7.2);
    expect(calculateRemainingBudget(2, 2.8)).toBe(-0.8);
  });

  it('groups totals by category, highest first', () => {
    expect(calculateCategoryTotals(expenses)).toEqual([
      { category: 'Transport', total: 2.5 },
      { category: 'Food', total: 0.3 },
    ]);
  });

  it('clamps budget usage', () => {
    expect(calculateBudgetUsage(100, 25)).toBe(25);
    expect(calculateBudgetUsage(100, 250)).toBe(100);
    expect(calculateBudgetUsage(0, 0)).toBe(0);
    expect(calculateBudgetUsage(0, 5)).toBe(100);
  });
});

describe('validation', () => {
  it('rejects bad expenses', () => {
    const errors = validateExpense({ title: '  ', amount: 'abc', category: 'Nope', date: '2026-02-30' });
    expect(Object.keys(errors).sort()).toEqual(['amount', 'category', 'date', 'title']);
    expect(validateExpense({ title: 'x', amount: '0', category: 'Food', date: '2026-01-01' }).amount).toBeDefined();
    expect(validateExpense({ title: 'x', amount: 'Infinity', category: 'Food', date: '2026-01-01' }).amount).toBeDefined();
  });

  it('accepts a good expense', () => {
    expect(validateExpense({ title: 'Rent', amount: '1200.50', category: 'Housing', date: '2024-02-29' })).toEqual({});
  });

  it('validates dates and budgets', () => {
    expect(isValidDateString('2025-02-29')).toBe(false);
    expect(isValidDateString('2026-10-27')).toBe(true);
    expect(validateBudget('-1')).not.toBeNull();
    expect(validateBudget('')).not.toBeNull();
    expect(validateBudget('0')).toBeNull();
  });
});
