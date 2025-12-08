// src/modals/ManualFoodModal.jsx
import React, { useState } from "react";
import "../styles/modal.css";

function ManualFoodModal({ meal, onClose, onSave }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  const handleSubmit = () => {
    if (!foodName || !calories) return;
    onSave(meal, {
      name: foodName,
      calories: Number(calories),
      protein: Number(protein || 0),
    });
    onClose();
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

        <button className="modal-btn" onClick={handleSubmit}>
          Add
        </button>

        <button className="modal-btn gray" onClick={onClose}>
          Close
        </button>


      </div>
    </div>
  );
}

export default ManualFoodModal;
