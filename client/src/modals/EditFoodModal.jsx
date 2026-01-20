import React, { useState } from "react";

function EditFoodModal({ food, mealType, index, onSave, onClose }) {
  const [name, setName] = useState(food.name);
  const [calories, setCalories] = useState(food.calories);
  const [protein, setProtein] = useState(food.protein);

  const handleSave = () => {
    onSave(mealType, index, {
      ...food,
      name,
      calories: Number(calories),
      protein: Number(protein)
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box elegant">

        <div className="modal-header">
          <h2>Edit Food</h2>
          <button className="x-close" onClick={onClose}>✕</button>
        </div>

        <input
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />

        <input
          className="input"
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default EditFoodModal;
