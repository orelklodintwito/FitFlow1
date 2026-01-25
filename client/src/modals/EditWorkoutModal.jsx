import { useState } from "react";
import { updateWorkout } from "../services/workouts";
import "../styles/modal.css";

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

      onSuccess(); // 🔄 ריענון מהשרת
      onClose();
    } catch (err) {
      console.error("❌ Failed to update workout", err);
      alert("Failed to update workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h2>Edit Workout</h2>

        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="modal-input"
        />

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="modal-input"
        />

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
