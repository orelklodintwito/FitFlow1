import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userMetrics"));
    if (saved) {
      setHeight(saved.height || "");
      setWeight(saved.weight || "");
    }
  }, []);

  const handleSave = () => {
    if (!height || !weight) {
      alert("Please enter both height and weight");
      return;
    }

    localStorage.setItem(
      "userMetrics",
      JSON.stringify({
        height: Number(height),
        weight: Number(weight),
      })
    );

    navigate("/profile");
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-card wide-card">
        <h2>Edit Height & Weight</h2>
        <p className="small-text">
          Update your body information to calculate BMI accurately
        </p>
      </div>

      {/* Form */}
      <div className="dashboard-card">
        {/* HEIGHT */}
        <label className="small-text">Height (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="e.g. 165"
          style={{
            width: "100%",
            marginTop: "6px",
            marginBottom: "14px",
            background: "#1e1e1e",
            color: "#fff",
            border: "1px solid #333",
            padding: "10px",
            borderRadius: "6px",
          }}
        />

        {/* WEIGHT */}
        <label className="small-text">Weight (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 60"
          style={{
            width: "100%",
            marginTop: "6px",
            marginBottom: "20px",
            background: "#1e1e1e",
            color: "#fff",
            border: "1px solid #333",
            padding: "10px",
            borderRadius: "6px",
          }}
        />

        {/* SAVE – טורקיז כמו ה-NAV */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "12px",
            background: "rgba(173, 216, 230, 0.75)",
            color: "#000",
            border: "1px solid rgba(173, 216, 230, 0.75)",
            borderRadius: "8px", // לא עגול
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Save
        </button>

        {/* CANCEL – משני, לא עגול */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            background: "#2a2a2a",
            color: "#bbb",
            border: "1px solid #3a3a3a",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditProfilePage;
