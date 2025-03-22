import { useEffect, useState } from 'react';

/**
 * useDebounce Hook
 *
 * A custom hook that debounces a value by delaying updates for a specified time.
 *
 * This hook is useful when you want to limit how frequently a value updates,
 * particularly for inputs that can change rapidly (e.g., search inputs, form fields).
 */

const useDebounce = <T>(value: T, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export { useDebounce };
