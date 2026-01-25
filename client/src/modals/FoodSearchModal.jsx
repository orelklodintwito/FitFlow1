import { useState } from "react";
import "../styles/modal.css";
import FoodItem from "../components/FoodItem.jsx";
import { addMeal } from "../services/meals";
import { saveChallengeDay } from "../services/challengeDays";

function FoodSearchModal({ meal, onClose, onSuccess }) {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [foods, setFoods] = useState([]);

  const searchFood = async () => {
    if (!query.trim()) return;

    const apiUrl =
      "https://corsproxy.io/?" +
      encodeURIComponent(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=12`
      );

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setFoods(data.products || []);
      setUrl(apiUrl);
    } catch (err) {
      console.error("Failed to fetch foods", err);
      setFoods([]);
    }
  };

  const handleAddFood = async (item) => {
    try {
      setLoadingAdd(true);

      await addMeal({
        name: item.product_name || "Unknown",
        calories: item.nutriments?.["energy-kcal_100g"] ?? 0,
        protein: item.nutriments?.proteins_100g ?? 0,
        mealType: meal,
      });

      // ⭐ חשוב: עדכון היום באתגר (Nutrition)
      await saveChallengeDay({});

      onSuccess(); // 🔄 ריענון ארוחות
      onClose();
    } catch (err) {
      console.error("Failed to add food", err);
      alert("Failed to add food");
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
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

        {foods.length === 0 && url && !loadingAdd && (
          <p className="empty-text">No results</p>
        )}

        <div className="modal-results">
          {foods.map((item) => (
            <FoodItem
              key={item.code}
              item={item}
              onAdd={() => handleAddFood(item)}
            />
          ))}
        </div>

        <button className="bottom-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default FoodSearchModal;
