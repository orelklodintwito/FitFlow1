// src/modals/AddWorkoutModal.jsx
import { useState } from "react";
import { addWorkout } from "../services/workouts";
import "../styles/modal.css";

// modal for adding a new workout to the current challenge day
// shows inputs for workout type, duration, and optional calories burned
function AddWorkoutModal({ onClose, onSuccess }) {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // basic validation - type and duration are required
    if (!workoutType || !duration) return;

    try {
      setLoading(true);

      await addWorkout({
        type: workoutType,
        duration: Number(duration),
        calories: Number(calories || 0), // default to 0 if empty
      });

      onSuccess(); // refresh parent data (e.g. reload workouts list)
      onClose();   // close the modal
    } catch (err) {
      console.error("Failed to add workout", err);
      alert("Failed to save workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    // clicking the overlay doesn't close the modal - only the Close button does
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2 className="modal-title">Add Workout</h2>

        <div className="modal-form">
          <label>Workout type</label>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
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

        {/* disabled while saving to prevent double submission */}
        <button
          className="modal-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
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