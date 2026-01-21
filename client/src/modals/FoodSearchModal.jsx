import { useState } from "react";
import "../styles/modal.css";
import { useApi } from "../hooks/useApi";
import FoodItem from "../components/FoodItem.jsx";
import { addMeal } from "../services/meals";

function FoodSearchModal({ meal, onClose, onSuccess }) {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);

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

  const handleAddFood = async (item) => {
    try {
      setLoadingAdd(true);

      await addMeal({
        name: item.product_name || "Unknown",
        calories: item.nutriments?.["energy-kcal_100g"] ?? 0,
        protein: item.nutriments?.proteins_100g ?? 0,
        mealType: meal,
      });

      onSuccess(); // 🔄 ריענון מהשרת
      onClose();
    } catch (err) {
      console.error("❌ Failed to add food from API", err);
      alert("Failed to add food");
    } finally {
      setLoadingAdd(false);
    }
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
              onAdd={() => handleAddFood(item)}
              disabled={loadingAdd}
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
