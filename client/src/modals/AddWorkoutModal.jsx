// src/modals/AddWorkoutModal.jsx
import { useState } from "react";
import { addWorkout } from "../services/workouts";
import "../styles/modal.css";

function AddWorkoutModal({ onClose, onSuccess }) {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type || !duration) return;

    try {
      setLoading(true);

      await addWorkout({
        type,
        duration: Number(duration),
        calories: Number(calories || 0),
      });

      onSuccess(); // ריענון נתונים
      onClose();
    } catch (err) {
      console.error("❌ Failed to add workout", err);
      alert("Failed to save workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2 className="modal-title">Add Workout</h2>

        <div className="modal-form">
          <label>Workout type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="modal-input"
            placeholder="Running, Strength, Yoga..."
          />

          <label>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="modal-input"
          />

          <label>Calories burned</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="modal-input"
          />
        </div>

        <button className="modal-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Add Workout"}
        </button>

        <button className="modal-btn gray" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AddWorkoutModal;
