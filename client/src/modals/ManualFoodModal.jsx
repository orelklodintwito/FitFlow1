import { useState } from "react";
import { addMeal } from "../services/meals";
import { saveChallengeDay } from "../services/challengeDays";
import "../styles/modal.css";

// modal for manually adding a food item (instead of searching the API)
// user types in the name, calories, and protein themselves
function ManualFoodModal({ meal, onClose, onSuccess }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // basic validation - name and calories are required
    if (!foodName || !calories) return;

    try {
      setLoading(true);

      // step 1: save the meal - this is the critical part
      await addMeal({
        name: foodName,
        calories: Number(calories),
        protein: Number(protein || 0),
        mealType: meal,
      });

      // step 2: update challenge day stats (non-blocking)
      try {
        await saveChallengeDay({});
      } catch (err) {
        console.warn("saveChallengeDay failed", err);
      }

      // step 3: refresh parent and close
      // setLoading before onClose to avoid setState on unmounted component
      await onSuccess?.();
      setLoading(false);
      onClose?.();
    } catch (err) {
      console.error("Failed to add meal", err);
      alert("Failed to save meal");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2 className="modal-title">Add Food to {meal}</h2>

        <div className="modal-form">
          <label>Food name</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="modal-input"
          />

          <label>Calories</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="modal-input"
          />

          <label>Protein (g)</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="modal-input"
          />
        </div>

        <button className="modal-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Add"}
        </button>

        <button className="modal-btn gray" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ManualFoodModal;