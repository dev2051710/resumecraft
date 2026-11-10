import { useCallback, useEffect, useRef, useState } from 'react';

function read(key, initial, sanitize) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initial;
    const parsed = JSON.parse(raw);
    return sanitize ? sanitize(parsed) : parsed;
  } catch {
    return initial;
  }
}

/**
 * useState that persists to localStorage.
 * - Writes are debounced, and flushed on tab hide / close / unmount so nothing is lost.
 * - Quota or privacy-mode errors are caught and exposed via `error`.
 */
export default function useLocalStorage(key, initial, { delay = 400, sanitize } = {}) {
  const [value, setValue] = useState(() => read(key, initial, sanitize));
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const latest = useRef(value);
  const dirty = useRef(false);
  const timer = useRef(null);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    try {
      window.localStorage.setItem(key, JSON.stringify(latest.current));
      dirty.current = false;
      setError(null);
      setSavedAt(Date.now());
      return true;
    } catch (e) {
      setError(e);
      return false;
    }
  }, [key]);

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? next(prev) : next;
        latest.current = v;
        return v;
      });
      dirty.current = true;
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, delay);
    },
    [flush, delay]
  );

  useEffect(() => {
    const save = () => {
      if (dirty.current) flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') save();
    };
    window.addEventListener('beforeunload', save);
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('beforeunload', save);
      window.removeEventListener('pagehide', save);
      document.removeEventListener('visibilitychange', onVisibility);
      save();
    };
  }, [flush]);

  return { value, setValue: update, flush, error, savedAt };
}
