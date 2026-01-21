import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "../styles/api.css";
import "../styles/modal.css";
import "../styles/components.css";
import "../styles/layout.css";

import { useFavorites } from "../context/FavoritesContext.jsx";
import { useApi } from "../hooks/useApi.js";
import { toggleMode } from "../redux/themeSlice.js";

const ApiPage = () => {
  const [search, setSearch] = useState("salad");
  const [query, setQuery] = useState("salad");

  // ⭐ CONTEXT – Favorites
  const { toggleFavorite, isFavorite } = useFavorites();

  // ⭐ REDUX – Theme
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  // ⭐ CUSTOM HOOK – API
  const url = `http://YOUR_SERVER_URL/api/external/meals?search=${query}`;
  const { data, loading, error } = useApi(url);

  const meals = data?.meals || [];

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className={`page-wrapper ${mode}`}>
      <div className="page-content">

        <h1 className="api-title">Healthy Recipes</h1>
        <p className="api-sub">Live results from TheMealDB API</p>

        {/* ⭐ REDUX UI – REQUIRED (Part 4) */}
        <button
          onClick={() => dispatch(toggleMode())}
          style={{
            marginBottom: "20px",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Switch to {mode === "dark" ? "Light" : "Dark"} Mode
        </button>

        {/* SEARCH */}
        <form className="search-area" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for meals... (salad, chicken, pasta)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </form>

        {/* ERROR */}
        {error && (
          <p className="error-text" style={{ textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* RESULTS */}
        {loading ? (
          <p className="loading-text" style={{ textAlign: "center" }}>
            Loading recipes...
          </p>
        ) : (
          <div className="meals-grid">
            {meals.length === 0 ? (
              <p className="no-results">No recipes found</p>
            ) : (
              meals.map((meal) => {
                const item = {
                  id: meal.idMeal,
                  name: meal.strMeal,
                };

                return (
                  <div key={meal.idMeal} className="recipe-card">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="recipe-img"
                    />

                    <h3 className="recipe-title">{meal.strMeal}</h3>

                    <p className="recipe-info">
                      <strong>Category:</strong> {meal.strCategory}
                    </p>

                    <p className="recipe-info">
                      <strong>Area:</strong> {meal.strArea}
                    </p>

                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noreferrer"
                      className="recipe-btn"
                    >
                      View Recipe ▶
                    </a>

                    {/* ⭐ CONTEXT FEATURE – Favorites */}
                    <button
                      className="recipe-btn"
                      onClick={() => toggleFavorite(item)}
                    >
                      {isFavorite(item.id)
                        ? "★ Favorited"
                        : "☆ Add to favorites"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiPage;
