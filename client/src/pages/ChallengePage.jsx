// src/pages/ChallengePage.jsx
import { useEffect, useMemo, useState } from "react";
import bgImage from "../assets/images/chal.png";
import "../styles/challenge.css";
import { useNavigate } from "react-router-dom";
import { getWorkouts, deleteWorkout } from "../services/workouts";
import EditWorkoutModal from "../modals/EditWorkoutModal";
import NutritionDonut from "../components/NutritionDonut";

import { getChallenge, saveChallenge } from "../services/challenge";
import {
  getTodayChallengeDay,
  saveChallengeDay,
  getChallengeDayByNumber,
} from "../services/challengeDays";


import { CHALLENGE_RULES } from "../challenges/challengeRules";
import AddWorkoutModal from "../modals/AddWorkoutModal";

function ChallengePage({ meals }) {

  // select | custom | active
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [durationDays, setDurationDays] = useState("");
const [workoutsGoal, setWorkoutsGoal] = useState("");

  const [challenge, setChallenge] = useState(null);
  const [today, setToday] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // custom challenge fields
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [reading, setReading] = useState("");
  const [workouts, setWorkouts] = useState([]);
const [editingWorkout, setEditingWorkout] = useState(null);

  const [customError, setCustomError] = useState("");

  // daily inputs
  const [dayWater, setDayWater] = useState("");
  const [dayReading, setDayReading] = useState("");
const [daySteps, setDaySteps] = useState("");

  // ui
  const [savingDay, setSavingDay] = useState(false);
  const [dayError, setDayError] = useState("");
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const rules = useMemo(() => {
    if (!challenge) return null;
    return CHALLENGE_RULES[challenge.type] || null;
  }, [challenge]);
const totalDays =
  challenge?.type === "custom"
    ? challenge?.durationDays
    : rules?.durationDays;

  /* ================= HELPERS ================= */
  const loadWorkouts = async () => {
  try {
    const res = await getWorkouts();
    setWorkouts(res.data || []);
  } catch (err) {
    console.error("Failed to load workouts", err);
  }
};

  const refreshToday = async () => {
    try {
      const res = await getTodayChallengeDay();
      setToday(res.data || null);
      if (res.data?.dayNumber) {
        setSelectedDay(res.data.dayNumber);
            }

      if (res.data) {
        setDayWater(
          res.data.waterLiters != null ? String(res.data.waterLiters) : ""
        );
        setDayReading(
          res.data.readingPages != null ? String(res.data.readingPages) : ""
        );
        setDaySteps(
  res.data.steps != null ? String(res.data.steps) : ""
);


      } else {
        setDayWater("");
        setDayReading("");
        setDaySteps("");

      }
       await loadWorkouts();
    } catch {
      setToday(null);
    }
  };

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChallenge();
        if (res.data) {
  setChallenge(res.data);
  setStep("active");
  await refreshToday(); // ⭐ זה הבסיס להכול
          
        } else {
          setStep("select");
        }
      } catch {
        setStep("select");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ================= PRESET ================= */
  const startPresetChallenge = async (type) => {
    try {
      setLoading(true);
      const res = await saveChallenge({
        type,
        displayMode: "daily",
        goals: {},
      });
      setChallenge(res.data);
      setStep("active");
      await refreshToday();
    } catch {
      alert("Failed to start challenge");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CUSTOM ================= */
const handleCustomSave = async (e) => {
  e.preventDefault();
  setCustomError("");

  try {
    setLoading(true);

    const res = await saveChallenge({
      type: "custom",
      durationDays: Number(durationDays),
      goals: {
        steps: steps ? Number(steps) : undefined,
        water: water ? Number(water) : undefined,
        reading: reading ? Number(reading) : undefined,
workouts: workoutsGoal ? Number(workoutsGoal) : undefined,

      },
    });

    setChallenge(res.data);
    setStep("active");
    await refreshToday();
  } catch {
    setCustomError("Failed to save challenge");
  } finally {
    setLoading(false);
  }
};

  /* ================= SAVE DAY ================= */
  const handleDeleteWorkout = async (id) => {
  const confirmed = window.confirm("Delete this workout?");
  if (!confirmed) return;

  try {
    await deleteWorkout(id);
    loadWorkouts();
  } catch {
    alert("Failed to delete workout");
  }
};
const autoSaveDay = async (payload) => {
  try {
    await saveChallengeDay(payload);
  } catch (err) {
    console.error("Auto save failed", err);
  }
};


 const handleSaveDay = async () => {
  setDayError("");
  setSavingDay(true);

  try {
const res = await saveChallengeDay({
  waterLiters: dayWater === "" ? undefined : Number(dayWater),
  readingPages: dayReading === "" ? undefined : Number(dayReading),
  steps: daySteps === "" ? undefined : Number(daySteps), // ✅
});



    // 🔥 המקור היחיד לאמת – תשובת השרת
    setToday(res.data);

    setDayWater(
      res.data.waterLiters != null ? String(res.data.waterLiters) : ""
    );
    setDayReading(
      res.data.readingPages != null ? String(res.data.readingPages) : ""
    );

    if (res.data.failed) {
      setDayError("You failed today.");
    }

    // ❌ לא לקרוא ל-refreshToday כאן

  } catch (err) {
    setDayError("Failed to save daily progress");
  } finally {
    setSavingDay(false);
  }
};

  const handleSelectDay = async (dayNumber) => {
  try {
    const res = await getChallengeDayByNumber(dayNumber);
    setToday(res.data);
    setSelectedDay(dayNumber);

    setDayWater(
      res.data?.waterLiters != null ? String(res.data.waterLiters) : ""
    );
    setDayReading(
      res.data?.readingPages != null ? String(res.data.readingPages) : ""
    );
  } catch {
    alert("Failed to load selected day");
  }
};
const isReadonly =
  selectedDay !== null && selectedDay !== today?.dayNumber;

const allMeals = meals
  ? Object.values(meals).flat()
  : [];

const totalCalories = allMeals.reduce(
  (sum, m) => sum + Number(m.calories || 0),
  0
);

const calorieGoal = rules?.calories || 2000;

const nutritionCompleted =
  Math.abs(totalCalories - calorieGoal) <= 100;






const taskStatus = [
  { enabled: true, done: nutritionCompleted },
  {
    enabled: typeof rules?.waterLiters === "number",
    done: today?.waterCompleted,
  },
  {
    enabled: typeof rules?.readingPages === "number",
    done: today?.readingCompleted,
  },
  {
    enabled: typeof rules?.steps === "number",   // ✅
    done: today?.stepsCompleted,
  },
  {
    enabled: !!rules?.workouts,
    done: today?.workoutsCompleted,
  },
];


const enabledTasks = taskStatus.filter(t => t.enabled);
const completedTasks = enabledTasks.filter(t => t.done).length;
const totalTasks = enabledTasks.length;

const progressPercent = Math.round(
  (completedTasks / totalTasks) * 100
);



const handleChangeChallenge = () => {
  const confirmed = window.confirm(
    "Are you sure you want to change the challenge?\nAll progress will be deleted."
  );

  if (!confirmed) return;

  setStep("select");
};

const handleRestartChallenge = () => {
  const confirmed = window.confirm(
    "Are you sure you want to restart the challenge?\nAll progress will be deleted."
  );

  if (!confirmed) return;

  // כרגע אותו UI flow – חיבור לשרת נעשה בשלב הבא
  setStep("select");
};


  if (loading || step === null) return null;


  return (
    <div
      className="challenge-page"
      style={{ "--bg-image": `url(${bgImage})` }}
    >
      <div className="challenge-container">

        {/* ================= SELECT ================= */}
        {step === "select" && (
          <>
            <h1>Choose Your Challenge</h1>
            <div className="auth-form">
              <button onClick={() => startPresetChallenge("14days")}>
                14 Day Challenge
              </button>
              <button onClick={() => startPresetChallenge("30days")}>
                30 Day Challenge
              </button>
              <button onClick={() => startPresetChallenge("75hard")}>
                75 Day Challenge
              </button>
              <button
                style={{ marginTop: 14 }}
                onClick={() => setStep("custom")}
              >
                Create Custom Challenge
              </button>
            </div>
          </>
        )}

   {/* ================= CUSTOM ================= */}
{step === "custom" && (
  <>
    <h1>Create Custom Challenge</h1>

    <form className="auth-form" onSubmit={handleCustomSave}>
      {/* Duration */}
      <input
        type="number"
        min="1"
        placeholder="Challenge duration (days)"
        value={durationDays}
        onChange={(e) => setDurationDays(e.target.value)}
        required
      />

      {/* Steps */}
      <input
        type="number"
        placeholder="Steps goal (optional)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
      />

      {/* Water */}
      <input
        type="number"
        placeholder="Water goal (liters, optional)"
        value={water}
        onChange={(e) => setWater(e.target.value)}
      />

      {/* Reading */}
      <input
        type="number"
        placeholder="Reading goal (pages, optional)"
        value={reading}
        onChange={(e) => setReading(e.target.value)}
      />

      {/* Workouts */}
      <input
  type="number"
  placeholder="Workouts goal (optional)"
  value={workoutsGoal}
  onChange={(e) => setWorkoutsGoal(e.target.value)}
/>


      {customError && <p className="error-text">{customError}</p>}

      <button type="submit">Save Challenge</button>

      <button
        type="button"
        style={{ background: "transparent", marginTop: 10 }}
        onClick={() => setStep("select")}
      >
        ← Back
      </button>
    </form>
  </>
)}


        {/* ================= ACTIVE ================= */}
        {step === "active" && challenge && rules && (
          <>
          <div className="challenge-header">
  <h1 className="challenge-title">
    {challenge.type === "custom" ? "Custom Challenge" : rules.name}
  </h1>

  <div className="challenge-day">
    Day {today?.dayNumber || 1}
    {totalDays && ` / ${totalDays}`}
  </div>
</div>

          <div className="days-strip">
  {Array.from({ length: totalDays || 0 }).map((_, i) => {
    const dayNum = i + 1;
    const isFuture = today && dayNum > today.dayNumber;
    const isActive = dayNum === selectedDay;

    return (
      <button
        key={dayNum}
        disabled={isFuture}
        className={`day-pill ${isActive ? "active" : ""}`}
        onClick={() => handleSelectDay(dayNum)}
      >
        {dayNum}
      </button>
    );
  })}
</div>

            <div className="challenge-active-layout">
              <div className="dashboard-card">
                <b>Status</b>
                
                <p>
                  {today?.failed
                    ? "FAILED"
                    : today?.completed
                    ? "COMPLETED"
                    : "IN PROGRESS"}
                </p>
                
                      <div className="daily-progress">
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${progressPercent}%` }}
    />
  </div>

<p className="small-text">
  Day {today?.dayNumber || 1}
  {totalDays ? ` / ${totalDays}` : ""}
  · {completedTasks} / {totalTasks} tasks completed
  ({progressPercent}%)
</p>
     <div style={{ marginTop: 20, textAlign: "center" }}>
  <button
    className="primary-btn"
    onClick={handleSaveDay}
    disabled={savingDay || isReadonly}
  >
    {savingDay ? "Saving..." : "Save Day"}
  </button>

  {dayError && (
    <p className="error-text" style={{ marginTop: 8 }}>
      {dayError}
    </p>
  )}
</div>
</div>

        

              </div>

              <div className="dashboard-card">
                <b>Today</b>

            

<div className="challenge-tiles grid-2">
  {/* 🥗 Nutrition – רוחב כפול */}
  <div className="challenge-tile wide">
    <div className="tile-header">
      <b>🥗 Nutrition</b>
   <span
  className="nutrition-view"
  onClick={() => navigate("/form")}
>
  View →
</span>


    </div>

    <NutritionDonut
      consumedCalories={totalCalories}
      targetCalories={calorieGoal}
      protein={allMeals.reduce(
        (sum, m) => sum + Number(m.protein || 0),
        0
      )}
    />
  </div>

  {/* 📖 Reading */}
  <div className="challenge-tile challenge-tile-fixed">
    <b>📖 Reading</b>
    <div className="challenge-tile-content">
      <input
        className="challenge-input"
        type="number"
        value={dayReading}
        onChange={(e) => {
          const val = e.target.value;
          setDayReading(val);
          autoSaveDay({
            readingPages: val === "" ? undefined : Number(val),
          });
        }}
      />
    </div>
  </div>

  {/* 💧 Water */}
  <div className="challenge-tile challenge-tile-fixed">
    <b>💧 Water</b>
    <div className="challenge-tile-content">
      <input
        className="challenge-input"
        type="number"
        value={dayWater}
        onChange={(e) => {
          const val = e.target.value;
          setDayWater(val);
          autoSaveDay({
            waterLiters: val === "" ? undefined : Number(val),
          });
        }}
      />
    </div>
  </div>

  {/* 🏋️ Workout */}
  <div className="challenge-tile">
    <b>🏋️ Workout</b>

    {workouts.length === 0 ? (
      <p className="workout-empty">No workouts yet.</p>
    ) : (
      workouts.map((w) => (
        <div key={w._id} className="food-item">
          <div>
            <strong>{w.type}</strong>
            <p className="small-text">
              {w.duration} min • {w.calories} kcal
            </p>
          </div>

          <div className="food-actions">
            <button onClick={() => setEditingWorkout(w)}>✏️</button>
            <button onClick={() => handleDeleteWorkout(w._id)}>❌</button>
          </div>
        </div>
      ))
    )}

    <button onClick={() => setShowWorkoutModal(true)}>
      + Add
    </button>
  </div>

<div className="challenge-tile challenge-tile-fixed">
  <b>🚶 Steps</b>

  <div className="challenge-tile-content">
    <input
      className="challenge-input"
      type="number"
      value={daySteps}
      onChange={(e) => {
        const val = e.target.value;
        setDaySteps(val);
        autoSaveDay({
          steps: val === "" ? undefined : Number(val),
        });
      }}
    />
  </div>
</div>


</div>
           

              </div>
            </div>

                    <div className="challenge-actions">
  <button
    className="secondary-btn"
    onClick={handleChangeChallenge}
  >
    Change Challenge
  </button>

  <button
    className="danger-btn"
    onClick={handleRestartChallenge}
  >
    Restart Challenge
  </button>
</div>

            
          </>
        )}
      </div>
        {editingWorkout && (
  <EditWorkoutModal
    workout={editingWorkout}
    onClose={() => setEditingWorkout(null)}
    onSuccess={loadWorkouts}
  />
)}

      {showWorkoutModal && (
        <AddWorkoutModal
          onClose={() => setShowWorkoutModal(false)}
          onSuccess={refreshToday}
        />
      )}
    </div>
  );
}

export default ChallengePage;
