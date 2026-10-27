import { useEffect, useState } from 'react';

// useState that persists to localStorage. `sanitize` validates parsed data and returns a safe value.
export function useLocalStorage(key, initialValue, sanitize = (value) => value) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : sanitize(JSON.parse(stored));
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be full or unavailable (e.g. private mode); keep working in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
