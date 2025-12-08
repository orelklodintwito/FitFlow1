// src/pages/SettingsPage.jsx
import React, { useState } from "react";

function SettingsPage() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="dashboard">

      {/* Page Header */}
      <div className="dashboard-card wide-card">
        <h2>Settings</h2>
        <p className="small-text">Manage your account, preferences, and goals</p>
      </div>

      {/* Language Selection */}
      <div className="dashboard-card">
        <h2>Language</h2>
        <p className="small-text">Choose the language for the app interface</p>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "100%",
            marginTop: "10px",
          }}
        >
          <option value="en">English</option>
          <option value="he">עברית</option>
        </select>
      </div>

      {/* Update Personal Info */}
      <div className="dashboard-card">
        <h2>Profile Information</h2>
        <p className="small-text">Update your personal and fitness details</p>

        <button
          onClick={() => alert("Profile update coming soon")}
          style={{ width: "100%", marginTop: "10px" }}
        >
          Update Personal Info
        </button>
      </div>

      {/* Manage Challenges */}
      <div className="dashboard-card">
        <h2>Challenges</h2>
        <p className="small-text">Create, edit or remove challenge goals</p>

        <button
          onClick={() => alert("Challenge editor coming soon")}
          style={{ width: "100%", marginTop: "10px" }}
        >
          Manage Challenges
        </button>
      </div>

      {/* Daily Goals */}
      <div className="dashboard-card">
        <h2>Daily Goals</h2>
        <p className="small-text">Modify calorie goals, steps target, water intake</p>

        <button
          onClick={() => alert("Daily goals editor coming soon")}
          style={{ width: "100%", marginTop: "10px" }}
        >
          Edit Daily Goals
        </button>
      </div>

    </div>
  );
}

export default SettingsPage;
