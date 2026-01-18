// src/modals/FoodSearchModal.jsx
import { useState } from "react";
import "../styles/modal.css";
import { useApi } from "../hooks/useApi";
import FoodItem from "../components/FoodItem.jsx";

function FoodSearchModal({ meal, onAddFood, onClose }) {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState(null);

  const { data, loading, error } = useApi(url);
  const foods = data?.products || [];

  const searchFood = () => {
    if (!query.trim()) return;

    const apiUrl =
      "https://corsproxy.io/?" +
      encodeURIComponent(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10`
      );

    setUrl(apiUrl);
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

        {loading && <p>Loading...</p>}
        {error && <p className="empty-text">{error}</p>}

        {!loading && url && foods.length === 0 && (
          <p className="empty-text">No results</p>
        )}

        <div className="modal-results">
          {foods.map((item) => (
            <FoodItem
              key={item.code}
              item={item}
              onAdd={() => {
                onAddFood(meal, {
                  name: item.product_name || "Unknown",
                  calories:
                    item.nutriments?.["energy-kcal_100g"] ?? 0,
                  protein:
                    item.nutriments?.proteins_100g ?? 0,
                });
                onClose();
              }}
            />
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
