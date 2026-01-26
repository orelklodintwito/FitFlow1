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
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    if (!profile) return;

    const key = profile.id
      ? `userMetrics_${profile.id}`
      : `userMetrics_${profile.email}`;

    const saved = JSON.parse(localStorage.getItem(key));
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
  const [loadingChallenge, setLoadingChallenge] = useState(true);

  useEffect(() => {
  const loadChallenge = async () => {
    try {
      const res = await getChallenge();

      if (res.data?.challenge) {
        setChallenge(res.data.challenge);
      } else {
        setChallenge(null);
      }
    } catch (err) {
      console.error("Failed to load challenge", err);
      setChallenge(null);
    } finally {
      setLoadingChallenge(false);
    }
  };

  loadChallenge();
}, []);



  /* ============================== */
  /* LOGOUT */
  /* ============================== */
const handleLogout = () => {
  const ok = window.confirm("Are you sure you want to log out?");
  if (!ok) return;

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userProfile");
window.dispatchEvent(new Event("user-changed"));

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
        {loadingChallenge && (
          <p className="small-text">Loading challenge...</p>
        )}

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
       {/* ===== NO CHALLENGE ===== */}
{!loadingChallenge && !challenge && (
  <>
    <p className="small-text">No active challenge</p>
    <p className="small-text">
      Start a challenge to get daily goals and progress tracking.
    </p>

    <button
      className="btn-green"
      style={{ marginTop: "10px" }}
      onClick={() => navigate("/challenge")}
    >
      Choose a Challenge →
    </button>
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
