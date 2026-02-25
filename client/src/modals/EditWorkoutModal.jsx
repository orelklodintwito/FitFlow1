import { useState } from "react";
import { updateWorkout } from "../services/workouts";
import "../styles/modal.css";

// modal for editing an existing workout
// lets the user change type, duration, and calories burned
function EditWorkoutModal({ workout, onClose, onSuccess }) {
  const [type, setType] = useState(workout.type);
  const [duration, setDuration] = useState(workout.duration);
  const [calories, setCalories] = useState(workout.calories || 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateWorkout(workout._id, {
        type,
        duration: Number(duration),
        calories: Number(calories),
      });

      // refresh parent data and close
      // setLoading before onClose to avoid setState on unmounted component
      await onSuccess?.();
      setLoading(false);
      onClose?.();
    } catch (err) {
      console.error("Failed to update workout", err);
      alert("Failed to update workout");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2>Edit Workout</h2>

        <label>Workout type</label>
        <input
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

export default EditWorkoutModal;