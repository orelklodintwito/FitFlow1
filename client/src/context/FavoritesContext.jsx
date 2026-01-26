// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // נשמר גם בלוקאל סטורג' כדי שלא ייעלם ברענון (לא חובה, אבל לא סותר דרישות)
  const userId = localStorage.getItem("userId"); // או איך שאת שומרת

const storageKey = userId ? `favorites_${userId}` : "favorites_guest";

const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : [];
});
  useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(favorites));
}, [favorites, storageKey]);


  // item צריך להכיל לפחות id ייחודי (או משהו קבוע כמו idMeal)
  const isFavorite = (id) => favorites.some((x) => x.id === id);

  const addFavorite = (item) => {
    setFavorites((prev) => {
      if (prev.some((x) => x.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((x) => x.id !== id));
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      return exists ? prev.filter((x) => x.id !== item.id) : [...prev, item];
    });
  };

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
