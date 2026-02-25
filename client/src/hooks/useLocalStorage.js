import { useState, useEffect } from "react";

// custom hook that syncs state with localStorage
// works like useState but persists the value across page refreshes
// used by FavoritesContext to store favorites per user
export function useLocalStorage(key, initialValue) {
  // on first render, try to load the saved value from localStorage
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      // if localStorage has corrupted data, fall back to initial value
      return initialValue;
    }
  });

  // save to localStorage whenever the value or key changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage might be full or unavailable (e.g. private browsing)
      console.error("Failed to save to localStorage");
    }
  }, [key, value]);

  return [value, setValue];
}