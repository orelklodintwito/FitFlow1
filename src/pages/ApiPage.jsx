// src/pages/ApiPage.jsx
import React, { useEffect, useState } from "react";
import "../styles/api.css";
import "../styles/modal.css";
import "../styles/components.css";
import "../styles/layout.css";

const ApiPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);     // ← חדש
  const [search, setSearch] = useState("salad");
  const [query, setQuery] = useState("salad");

  /* ========================================================= */
  /* FETCH FROM API */
  /* ========================================================= */
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then(res => {
        if (!res.ok) throw new Error("Network response error");
        return res.json();
      })
      .then(data => {
        setMeals(data.meals || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load recipes. Please try again.");
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">

        <h1 className="api-title">Healthy Recipes</h1>
        <p className="api-sub">Live results from TheMealDB API</p>

        {/* SEARCH AREA */}
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

        {/* ERROR HANDLING */}
        {error && <p className="error-text" style={{ textAlign: "center" }}>{error}</p>}

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
              meals.map((meal) => (
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
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiPage;
