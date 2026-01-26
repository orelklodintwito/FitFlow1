import { useState } from "react";
import { addMeal } from "../services/meals";
import { saveChallengeDay } from "../services/challengeDays";
import "../styles/modal.css";

function ManualFoodModal({ meal, onClose, onSuccess }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!foodName || !calories) return;

  try {
    setLoading(true);

    // שמירת הארוחה – זה העיקר
    await addMeal({
      name: foodName,
      calories: Number(calories),
      protein: Number(protein || 0),
      mealType: meal,
    });

    // עדכון אתגר – לא מפיל אם נכשל
    try {
      await saveChallengeDay({});
    } catch (err) {
      console.warn("⚠️ saveChallengeDay failed", err);
    }

    onSuccess();
    onClose();
  } catch (err) {
    console.error("❌ Failed to add meal", err);
    alert("Failed to save meal");
  } finally {
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
