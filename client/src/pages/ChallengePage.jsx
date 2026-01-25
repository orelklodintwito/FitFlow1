// src/pages/ChallengePage.jsx
import { useEffect, useMemo, useState } from "react";
import bgImage from "../assets/images/chal.png";
import "../styles/challenge.css";
import { useNavigate } from "react-router-dom";

import { getChallenge, saveChallenge } from "../services/challenge";
import {
  getTodayChallengeDay,
  saveChallengeDay,
  getChallengeDayByNumber,
} from "../services/challengeDays";


import { CHALLENGE_RULES } from "../challenges/challengeRules";
import AddWorkoutModal from "../modals/AddWorkoutModal";

function ChallengePage() {
  // select | custom | active
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [today, setToday] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // custom challenge fields
  const [displayMode, setDisplayMode] = useState("daily");
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [workouts, setWorkouts] = useState("");
  const [customError, setCustomError] = useState("");

  // daily inputs
  const [dayWater, setDayWater] = useState("");
  const [dayReading, setDayReading] = useState("");

  // ui
  const [savingDay, setSavingDay] = useState(false);
  const [dayError, setDayError] = useState("");
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const rules = useMemo(() => {
    if (!challenge) return null;
    return CHALLENGE_RULES[challenge.type] || null;
  }, [challenge]);

  /* ================= HELPERS ================= */
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
      } else {
        setDayWater("");
        setDayReading("");
      }
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
          await refreshToday();
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
        displayMode,
        goals: {
          steps: steps ? Number(steps) : undefined,
          water: water ? Number(water) : undefined,
          workouts: workouts ? Number(workouts) : undefined,
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
  const handleSaveDay = async () => {
    setDayError("");
    setSavingDay(true);

    try {
      const res = await saveChallengeDay({
        waterLiters: dayWater === "" ? undefined : Number(dayWater),
        readingPages: dayReading === "" ? undefined : Number(dayReading),
      });

      setToday(res.data);

      setDayWater(
        res.data?.waterLiters != null ? String(res.data.waterLiters) : ""
      );
      setDayReading(
        res.data?.readingPages != null ? String(res.data.readingPages) : ""
      );

      if (res.data?.failed) {
        setDayError("You failed today.");
      }
    } catch {
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
const isReadonly = selectedDay !== today?.dayNumber;
const totalTasks = 4;

const completedTasks = today
  ? [
      today.nutritionCompleted,
      today.waterCompleted,
      today.readingCompleted,
      today.workoutsCompleted,
    ].filter(Boolean).length
  : 0;

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
              <div className="auth-toggle">
                <button
                  type="button"
                  className={displayMode === "daily" ? "active" : ""}
                  onClick={() => setDisplayMode("daily")}
                >
                  Daily
                </button>
                <button
                  type="button"
                  className={displayMode === "weekly" ? "active" : ""}
                  onClick={() => setDisplayMode("weekly")}
                >
                  Weekly
                </button>
              </div>

              <input
                type="number"
                placeholder="Steps goal"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
             <input
  type="number"
  value={dayWater}
  disabled={isReadonly}
  onChange={(e) => setDayWater(e.target.value)}
/>

              <input
                type="number"
                placeholder="Workouts goal"
                value={workouts}
                onChange={(e) => setWorkouts(e.target.value)}
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
  <h1 className="challenge-title">{rules.name}</h1>
  <div className="challenge-day">
    Day {today?.dayNumber || 1}
    {rules.durationDays && ` / ${rules.durationDays}`}
  </div>
</div>

            <div className="days-strip">
  {Array.from({ length: rules.durationDays }).map((_, i) => {
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
    {completedTasks} / {totalTasks} completed ({progressPercent}%)
  </p>
</div>

               <button
  onClick={handleSaveDay}
  disabled={savingDay || isReadonly}
>

                  {savingDay ? "Saving..." : "Save Daily Progress"}
                </button>

                {dayError && <p className="error-text">{dayError}</p>}
              </div>

              <div className="dashboard-card">
                <b>Today</b>

                <div className="challenge-tiles">
                 <div className="challenge-tile">
   <b>🥗 Nutrition</b>
  <button
    onClick={() => navigate("/form")}
  >
    + Add Meal
  </button>
</div>


                  <div className="challenge-tile">
                     <b>💧 Water</b>
                    <input
                      type="number"
                      value={dayWater}
                      onChange={(e) => setDayWater(e.target.value)}
                    />
                  </div>

                  <div className="challenge-tile">
                     <b>📖 Reading</b>
                   <input
  type="number"
  value={dayReading}
  disabled={isReadonly}
  onChange={(e) => setDayReading(e.target.value)}
/>

                  </div>

                  <div className="challenge-tile">
                     <b>🏋️ Workout</b>
                    <button onClick={() => setShowWorkoutModal(true)}>
                      + Add
                    </button>
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
