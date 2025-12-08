// src/modals/FoodSearchModal.jsx
import React, { useState } from "react";
import "../styles/modal.css";

function FoodSearchModal({ meal, onClose, onAddFood }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchFood = async () => {
    const api = `https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=demo&app_key=demo`;
    const res = await fetch(api);
    const data = await res.json();
    setResults(data.hints || []);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">

        <h2 className="modal-title">Search Food for {meal}</h2>

        <input
          className="modal-input"
          placeholder="Search food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="modal-btn" onClick={searchFood}>
          Search
        </button>

        <div className="modal-results">
          {results.length === 0 && <p className="empty-text">No results</p>}

          {results.map((item, i) => (
            <div key={i} className="result-row">
              <span>{item.food.label}</span>

              <button
                className="modal-btn small"
                onClick={() =>
                  onAddFood(meal, {
                    name: item.food.label,
                    calories: Math.round(item.food.nutrients.ENERC_KCAL),
                    protein: Math.round(item.food.nutrients.PROCNT),
                  })
                }
              >
                Add
              </button>
            </div>
          ))}
        </div>

        <button className="modal-btn gray" onClick={onClose}>
          Close
        </button>


      </div>
    </div>
  );
}

export default FoodSearchModal;
