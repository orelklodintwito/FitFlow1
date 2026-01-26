import { useState } from "react";
import { updateMeal } from "../services/meals";
import { saveChallengeDay } from "../services/challengeDays";
import "../styles/modal.css";

function EditFoodModal({ food, onClose, onSuccess }) {
  const [name, setName] = useState(food.name);
  const [calories, setCalories] = useState(food.calories);
  const [protein, setProtein] = useState(food.protein || 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
  try {
    setLoading(true);

    // ✅ עדכון הארוחה – זה הקריטי
    await updateMeal(food._id, {
      name,
      calories: Number(calories),
      protein: Number(protein),
    });

    // ⚠️ עדכון אתגר – לא מפיל אם נכשל
    try {
      await saveChallengeDay({});
    } catch (err) {
      console.warn("⚠️ saveChallengeDay failed (edit)", err);
    }

    onSuccess();
    onClose();
  } catch (err) {
    console.error("❌ Failed to update meal", err);
    alert("Failed to update meal");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2>Edit Food</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="modal-input"
        />

        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="modal-input"
        />

        <input
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="modal-input"
        />

        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        <button className="gray" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditFoodModal;
