import { useEffect, useState } from 'react';
import { parseAmount, validateBudget } from '../utils/validation';

function BudgetForm({ budget, onUpdateBudget }) {
  const [value, setValue] = useState(String(budget));
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(String(budget));
  }, [budget]);

  function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateBudget(value);
    setError(validationError);
    if (validationError) {
      setSaved(false);
      return;
    }
    onUpdateBudget(parseAmount(value));
    setSaved(true);
  }

  return (
    <section className="card" aria-labelledby="budget-heading">
      <h2 id="budget-heading">Monthly budget</h2>
      <form className="budget-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="budget-input">Budget amount (USD)</label>
          <div className="input-row">
            <input
              id="budget-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setSaved(false);
              }}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'budget-error' : undefined}
            />
            <button type="submit" className="btn btn-primary">
              {budget > 0 ? 'Update' : 'Set budget'}
            </button>
          </div>
          {error && (
            <p id="budget-error" className="error" role="alert">
              {error}
            </p>
          )}
          <p className="status" role="status" aria-live="polite">
            {saved ? 'Budget saved.' : ''}
          </p>
        </div>
      </form>
    </section>
  );
}

export default BudgetForm;
