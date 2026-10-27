import { useRef, useState } from 'react';
import { CATEGORIES, parseAmount, validateExpense } from '../utils/validation';

const FIELD_ORDER = ['title', 'amount', 'category', 'date'];

// Local-time YYYY-MM-DD, so the default isn't shifted to tomorrow/yesterday by UTC.
function todayString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

const emptyForm = () => ({ title: '', amount: '', category: CATEGORIES[0], date: todayString() });

function ExpenseForm({ onAddExpense }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const fieldRefs = useRef({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateExpense(form);
    setErrors(validationErrors);

    const firstInvalid = FIELD_ORDER.find((field) => validationErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    onAddExpense({
      title: form.title.trim(),
      amount: parseAmount(form.amount),
      category: form.category,
      date: form.date,
    });
    setForm(emptyForm());
    fieldRefs.current.title?.focus();
  }

  const fieldProps = (name) => ({
    id: `expense-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    ref: (el) => {
      fieldRefs.current[name] = el;
    },
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `expense-${name}-error` : undefined,
  });

  const errorMessage = (name) =>
    errors[name] && (
      <p id={`expense-${name}-error`} className="error" role="alert">
        {errors[name]}
      </p>
    );

  return (
    <section className="card" aria-labelledby="expense-form-heading">
      <h2 id="expense-form-heading">Add expense</h2>
      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <div className="field field-full">
          <label htmlFor="expense-title">Title</label>
          <input type="text" placeholder="e.g. Groceries" autoComplete="off" maxLength={80} {...fieldProps('title')} />
          {errorMessage('title')}
        </div>

        <div className="field">
          <label htmlFor="expense-amount">Amount (USD)</label>
          <input type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" {...fieldProps('amount')} />
          {errorMessage('amount')}
        </div>

        <div className="field">
          <label htmlFor="expense-category">Category</label>
          <select {...fieldProps('category')}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errorMessage('category')}
        </div>

        <div className="field field-full">
          <label htmlFor="expense-date">Date</label>
          <input type="date" {...fieldProps('date')} />
          {errorMessage('date')}
        </div>

        <button type="submit" className="btn btn-primary field-full">
          Add expense
        </button>
      </form>
    </section>
  );
}

export default ExpenseForm;
