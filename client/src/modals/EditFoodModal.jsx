import { useState } from "react";
import { updateMeal } from "../services/meals";
import { saveChallengeDay } from "../services/challengeDays";
import "../styles/modal.css";

// modal for editing an existing food/meal entry
// lets the user change name, calories, and protein
function EditFoodModal({ food, onClose, onSuccess }) {
  const [name, setName] = useState(food.name);
  const [calories, setCalories] = useState(food.calories);
  const [protein, setProtein] = useState(food.protein || 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    // step 1: update the meal itself - this is the critical part
    try {
      await updateMeal(food._id, {
        name,
        calories: Number(calories),
        protein: Number(protein),
      });
    } catch (err) {
      console.error("updateMeal failed", err);
      alert("Failed to update meal");
      setLoading(false);
      return; // stop here if meal update failed
    }

    // step 2: update challenge day stats (e.g. recalculate nutrition completion)
    // this is non-blocking - if it fails the meal is still saved
    try {
      await saveChallengeDay({});
    } catch (err) {
      console.warn("saveChallengeDay failed (edit)", err);
    }

    // step 3: refresh parent data and close
    // setLoading before onClose to avoid setState on unmounted component
    await onSuccess?.();
    setLoading(false);
    onClose?.();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2>Edit Food</h2>

        <label>Food name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="modal-input"
          placeholder="Food name"
        />

        <label>Calories</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="modal-input"
          placeholder="Calories"
        />

        <label>Protein (g)</label>
        <input
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="modal-input"
          placeholder="Protein (g)"
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