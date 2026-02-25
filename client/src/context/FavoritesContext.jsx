// src/context/FavoritesContext.jsx
import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FavoritesContext = createContext(null);

// safely parse JSON from localStorage without crashing on corrupted data
function safeParseProfile() {
  try {
    return JSON.parse(localStorage.getItem("userProfile"));
  } catch {
    return null;
  }
}

// provides favorites functionality to the entire app
// favorites are stored in localStorage per user, so each user has their own list
export function FavoritesProvider({ children }) {

  // get the current user id from localStorage
  // tries id, _id, and email as fallbacks
  const [userId, setUserId] = useState(() => {
    const profile = safeParseProfile();
    return profile?.id || profile?._id || profile?.email || null;
  });

  // listen for changes to localStorage (e.g. login/logout in another tab)
  // also runs once on mount to make sure we have the latest user
  useEffect(() => {
    const syncUser = () => {
      const profile = safeParseProfile();
      setUserId(profile?.id || profile?._id || profile?.email || null);
    };

    window.addEventListener("storage", syncUser);
    syncUser();

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // each user gets their own favorites key in localStorage
  // if not logged in, falls back to a shared guest key
  const storageKey = userId ? `favorites_${userId}` : "favorites_guest";

  const [favorites, setFavorites] = useLocalStorage(storageKey, []);

  // check if an item is already in favorites by its id
  const isFavorite = useCallback(
    (id) => favorites.some((x) => x.id === id),
    [favorites]
  );

  // add an item if it's not already there
  const addFavorite = useCallback((item) => {
    setFavorites((prev) => {
      if (prev.some((x) => x.id === item.id)) return prev;
      return [...prev, item];
    });
  }, [setFavorites]);

  // remove an item by id
  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((x) => x.id !== id));
  }, [setFavorites]);

  // add if not exists, remove if exists
  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      return exists ? prev.filter((x) => x.id !== item.id) : [...prev, item];
    });
  }, [setFavorites]);

  // now useMemo actually works properly since all functions are wrapped in useCallback
  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// custom hook - makes sure you're inside the provider
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}