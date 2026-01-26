import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChallenge } from "../services/challenge";

function SettingsPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  /* ============================== */
  /* PERSONAL INFO (LOCAL STORAGE) */
  /* ============================== */
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userMetrics"));
    if (saved) {
      setHeight(saved.height);
      setWeight(saved.weight);
    }
  }, []);
    useEffect(() => {
      const savedProfile = JSON.parse(
        localStorage.getItem("userProfile")
      );

      if (savedProfile) {
        setUserProfile(savedProfile);
      }
    }, []);

  const bmi =
    height && weight
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : null;

  /* ============================== */
  /* SMART PERSONAL SUGGESTIONS */
  /* ============================== */
  const customSuggested =
    height && weight
      ? {
          calories: Math.round(weight * 30),
          protein: Math.round(weight * 1.6),
          water: Math.round(weight * 0.035 * 10) / 10,
          steps: bmi > 25 ? 7000 : 9000,
          workouts: 1,
          workoutMin: 45,
          reading: 10,
        }
      : null;

  /* ============================== */
  /* CHALLENGE INFO */
  /* ============================== */
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    getChallenge()
      .then((res) => setChallenge(res.data))
      .catch(() => setChallenge(null));
  }, []);

  /* ============================== */
  /* LOGOUT */
  /* ============================== */
const handleLogout = () => {
  const ok = window.confirm("Are you sure you want to log out?");
  if (!ok) return;

  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
};


  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}
      <div className="dashboard-card wide-card">
        <h2>My Profile</h2>
        <p className="small-text">
          Personal information, health data and challenge goals
        </p>
      </div>

      {/* ================= PERSONAL INFO ================= */}
      <div className="dashboard-card">
        <h2>Personal Information</h2>
        <p className="small-text">Your basic profile details</p>

        <p>
          <strong>Name:</strong>{" "}
          {userProfile?.name || "—"}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {userProfile?.email || "—"}
        </p>

      </div>

      {/* ================= BODY & HEALTH ================= */}
      <div className="dashboard-card">
        <h2>Body & Health</h2>
        <p className="small-text">Based on your height and weight</p>

        <p>Height: {height || "-"} cm</p>
        <p>Weight: {weight || "-"} kg</p>
        <p><strong>BMI:</strong> {bmi || "Not calculated"}</p>

        <button
          style={{ width: "100%", marginTop: "10px" }}
          onClick={() => navigate("/profile/edit")}
        >
          Edit Height & Weight
        </button>
      </div>

      {/* ================= GOALS & CHALLENGES ================= */}
      <div className="dashboard-card">
        <h2>Goals & Challenges</h2>

        {/* ===== NO CHALLENGE ===== */}
        {!challenge && (
          <>
            <p className="small-text">No active challenge</p>

            {customSuggested ? (
              <div className="small-text" style={{ marginTop: "10px" }}>
                <p><strong>Suggested goals for you:</strong></p>
                <p>🥗 Calories: ~{customSuggested.calories} kcal/day</p>
                <p>🥩 Protein: ~{customSuggested.protein} g/day</p>
                <p>💧 Water: {customSuggested.water} L/day</p>
                <p>👣 Steps: {customSuggested.steps}/day</p>
                <p>🏋️ Workout: {customSuggested.workouts} × {customSuggested.workoutMin} min</p>
                <p>📖 Reading: ≥ {customSuggested.reading} pages</p>
              </div>
            ) : (
              <p className="small-text">
                Add height & weight to get personalized recommendations.
              </p>
            )}
          </>
        )}

        {/* ===== 14 DAYS ===== */}
        {challenge?.type === "14days" && (
          <div className="small-text">
            <p><strong>14-Day Challenge</strong></p>
            <p>Difficulty: Medium</p>
            <p>🥗 Nutrition: protein + calories (±100)</p>
            <p>🏋️ Workout: 1 × 45 min</p>
            <p>💧 Water: 2L</p>
            <p>📖 Reading: ≥ 10 pages</p>
            <p>❌ Failure: reset to Day 1</p>
          </div>
        )}

        {/* ===== 30 DAYS ===== */}
        {challenge?.type === "30days" && (
          <div className="small-text">
            <p><strong>30-Day Challenge</strong></p>
            <p>Difficulty: High</p>
            <p>🥗 Nutrition: protein + calories (±100)</p>
            <p>🏋️ Workouts: 2 × 45 min</p>
            <p>💧 Water: 2L</p>
            <p>📖 Reading: ≥ 10 pages</p>
            <p>❌ Failure: reset to Day 1</p>
          </div>
        )}

        {/* ===== 75 DAYS ===== */}
        {challenge?.type === "75hard" && (
          <div className="small-text">
            <p><strong>75-Day Challenge</strong></p>
            <p>Difficulty: Very High</p>
            <p>🥗 Nutrition: protein + calories (±100)</p>
            <p>🏋️ Workouts: 2 × 45 min</p>
            <p>💧 Water: 2L</p>
            <p>📖 Reading: ≥ 10 pages</p>
            <p>❌ Failure: reset to Day 1</p>
          </div>
        )}

        {/* ===== CUSTOM ===== */}
        {challenge?.type === "custom" && (
          <div className="small-text">
            <p><strong>Custom Challenge</strong></p>
            <p>Personalized for your body & goals</p>

            <p>🥗 Calories: {challenge.goals?.calories}</p>
            <p>🥩 Protein: {challenge.goals?.protein}</p>
            <p>👣 Steps: {challenge.goals?.steps}</p>
            <p>💧 Water: {challenge.goals?.water}</p>
            <p>🏋️ Workouts: {challenge.goals?.workouts}</p>
            <p>📖 Reading: {challenge.goals?.reading}</p>
          </div>
        )}

       
      </div>

      {/* ================= ACCOUNT ================= */}
      <div className="dashboard-card">
        <h2>Account</h2>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            marginTop: "10px",
            background: "#ff5c5c",
            color: "white",
          }}
        >
          Log Out
        </button>
      </div>

    </div>
  );
}

export default SettingsPage;
