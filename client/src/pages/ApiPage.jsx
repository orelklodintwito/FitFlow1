import React, { useState } from "react";
import { useSelector } from "react-redux";
import PageState from "../components/PageState";

import "../styles/api.css";
import "../styles/modal.css";
import "../styles/components.css";
import "../styles/layout.css";

import { useFavorites } from "../context/FavoritesContext.jsx";
import { useApi } from "../hooks/useApi.js";

const ApiPage = () => {
  const [search, setSearch] = useState("salad");
  const [query, setQuery] = useState("salad");

  /* ===================== CONTEXT ===================== */
  const { toggleFavorite, isFavorite } = useFavorites();

  /* ===================== REDUX ===================== */
  const mode = useSelector((state) => state.theme.mode);

  /* ===================== API ===================== */
  const url = `/api/external/meals?search=${query}`;
  const { data, loading, error } = useApi(url);

  const meals = data?.meals || [];

  /* ===================== PAGE STATE ===================== */
  let pageStatus = "ready";

  if (loading) {
    pageStatus = "loading";
  } else if (error) {
    pageStatus = "error";
  } else if (meals.length === 0) {
    pageStatus = "empty";
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  if (pageStatus !== "ready") {
    return (
      <div className={`page-wrapper ${mode}`}>
        <div className="page-content">
          <PageState
            status={pageStatus}
            emptyText="No recipes found. Try another search."
          />
        </div>
      </div>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <div className={`page-wrapper ${mode}`}>
      <div className="page-content">
        <h1 className="api-title">Healthy Recipes</h1>
        <p className="api-sub">Live results from TheMealDB API</p>

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

        {/* RESULTS */}
        <div className="meals-grid">
          {meals.map((meal) => {
            const item = {
              id: meal.idMeal,
              name: meal.strMeal,
              thumb: meal.strMealThumb,
              category: meal.strCategory,
              area: meal.strArea,
              youtube: meal.strYoutube,
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
          })}
        </div>
      </div>
    </div>
  );
};

export default ApiPage;
