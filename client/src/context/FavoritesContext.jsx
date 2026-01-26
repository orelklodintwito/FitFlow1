// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  
const [userId, setUserId] = useState(() => {
  const profile = JSON.parse(localStorage.getItem("userProfile"));
  return profile?.id || null;
});
useEffect(() => {
  const syncUser = () => {
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    setUserId(profile?.id || null);
  };

  window.addEventListener("storage", syncUser);
  syncUser(); // ריצה מיידית

  return () => window.removeEventListener("storage", syncUser);
}, []);


const storageKey = userId ? `favorites_${userId}` : "favorites_guest";

const [favorites, setFavorites] = useState([]);

  useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(favorites));
}, [favorites, storageKey]);
useEffect(() => {
  const saved = localStorage.getItem(storageKey);
  setFavorites(saved ? JSON.parse(saved) : []);
}, [storageKey]);


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
