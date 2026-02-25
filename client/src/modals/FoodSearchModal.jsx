import { useState } from "react";
import "../styles/modal.css";
import FoodItem from "../components/FoodItem.jsx";
import { addMeal } from "../services/meals";
import { saveChallengeDay } from "../services/challengeDays";

// modal for searching foods from OpenFoodFacts API and adding them as meals
// receives the meal type (breakfast, lunch, etc.) and callbacks for success/close
function FoodSearchModal({ meal, challengeDayId, onClose, onSuccess }) {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // search OpenFoodFacts API for products matching the query
  const searchFood = async () => {
    if (!query.trim()) return;

    const apiUrl =
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=12`;

    try {
      setLoadingSearch(true);
      setHasSearched(false); // reset so "No results" doesn't flash during loading
      setFoods([]);

      const res = await fetch(apiUrl);
      const data = await res.json();

      setFoods(data.products || []);
    } catch (err) {
      console.error("Failed to fetch foods", err);
      setFoods([]);
    } finally {
      setLoadingSearch(false);
      setHasSearched(true); // now safe to show "No results" if empty
    }
  };

  // add a selected food item as a meal
  const handleAddFood = async (item) => {
    try {
      setLoadingAdd(true);

      // step 1: save the meal - this is the critical part
      await addMeal({
        name: foodName,
        calories: Number(calories),
        protein: Number(protein || 0),
        mealType: meal,
        challengeDay: challengeDayId || null,
      });

      // step 2: update challenge day stats (non-blocking)
      try {
        await saveChallengeDay({});
      } catch (err) {
        console.warn("saveChallengeDay failed (food search)", err);
      }

      // step 3: refresh parent and close
      await onSuccess?.();
      setLoadingAdd(false);
      onClose?.();
    } catch (err) {
      console.error("Failed to add food", err);
      alert("Failed to add food");
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

        {/* loading indicator while searching */}
        {loadingSearch && (
          <p className="loading-text">Searching food data…</p>
        )}

        {/* show "No results" only after search completed with empty results */}
        {hasSearched && !loadingSearch && foods.length === 0 && (
          <p className="empty-text">No results</p>
        )}

        {/* search results list */}
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