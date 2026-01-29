// src/pages/ChallengePage.jsx
import bgImage from "../assets/images/chal.png";
import "../styles/challenge.css";

import EditWorkoutModal from "../modals/EditWorkoutModal";
import AddWorkoutModal from "../modals/AddWorkoutModal";
import NutritionDonut from "../components/NutritionDonut";

import { useChallengePage } from "../hooks/useChallengePage";

function ChallengePage({ meals }) {
  const c = useChallengePage(meals);

  const {
    step,
    loading,
    rules,
    today,
    totalDays,
    selectedDay,
    workouts,
    editingWorkout,
    showWorkoutModal,

    durationDays,
    setDurationDays,
    workoutsGoal,
    setWorkoutsGoal,
    steps,
    setSteps,
    water,
    setWater,
    reading,
    setReading,

    dayWater,
    setDayWater,
    dayReading,
    setDayReading,
    daySteps,
    setDaySteps,

    savingDay,
    dayError,
    customError,
    isReadonly,

    progressPercent,
    completedTasks,
    totalTasks,

    totalCalories,
    calorieGoal,
    allMeals,

    setStep,
    setEditingWorkout,
    setShowWorkoutModal,

    navigate,
    startPresetChallenge,
    handleCustomSave,
    handleSaveDay,
    handleSelectDay,
    handleDeleteWorkout,
    autoSaveDay,
    handleChangeChallenge,
    handleRestartChallenge,
    refreshToday,
    loadWorkouts,
  } = c;
  const isReadonlyDay =
  selectedDay !== null && selectedDay !== today?.dayNumber;

const dayToShow = isReadonlyDay ? c.viewedDay : today;

  /* ============================== */
  /* PAGE STATE (testing / UX) */
  /* ============================== */
  let pageStatus = "ready";

  if (loading) {
    pageStatus = "loading";
  } else if (!step) {
    pageStatus = "error";
  } else if (step === "active" && !rules) {
    pageStatus = "error";
  }

  if (pageStatus !== "ready") {
    return (
      <div
        className="challenge-page"
        style={{ "--bg-image": `url(${bgImage})` }}
      >
        <div className="challenge-container">
          <div className="dashboard-card">
            {pageStatus === "loading" && (
              <>
                <h2>Loading challenge…</h2>
                <p className="small-text">
                  If this stays stuck, it’s probably an API/Auth issue.
                </p>
              </>
            )}

            {pageStatus === "error" && (
              <>
                <h2>Something went wrong</h2>
                <p className="small-text">
                  Could not load challenge data. Please refresh or log in again.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }


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
              <input
                type="number"
                min="1"
                placeholder="Challenge duration (days)"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Steps goal (optional)"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />

              <input
                type="number"
                placeholder="Water goal (liters, optional)"
                value={water}
                onChange={(e) => setWater(e.target.value)}
              />

              <input
                type="number"
                placeholder="Reading goal (pages, optional)"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
              />

              <input
                type="number"
                placeholder="Workouts goal (optional)"
                value={workoutsGoal}
                onChange={(e) => setWorkoutsGoal(e.target.value)}
              />

              {customError && (
                <p className="error-text">{customError}</p>
              )}

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
        {step === "active" && rules && (
          <>
            <div className="challenge-header">
              <h1 className="challenge-title">
                {rules.name || "Custom Challenge"}
              </h1>

              <div className="challenge-day">
                Day {today?.dayNumber || 1}
                {totalDays && ` / ${totalDays}`}
              </div>
            </div>

            <div className="days-strip">
              {Array.from({ length: totalDays || 0 }).map((_, i) => {
                const dayNum = i + 1;
                const isFuture =
                  today && dayNum > today.dayNumber;
                const isActive = dayNum === selectedDay;

                return (
                  <button
                    key={dayNum}
                    disabled={isFuture}
                    className={`day-pill ${
                      isActive ? "active" : ""
                    }`}
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
                      style={{
                        width: `${progressPercent}%`,
                      }}
                    />
                  </div>

                  <p className="small-text">
                    Day {today?.dayNumber || 1}
                    {totalDays ? ` / ${totalDays}` : ""} ·{" "}
                    {completedTasks} / {totalTasks} tasks completed
                    ({progressPercent}%)
                  </p>

                  <div
                    style={{
                      marginTop: 20,
                      textAlign: "center",
                    }}
                  >
                    <button
                      className="primary-btn"
                      onClick={handleSaveDay}
                      disabled={savingDay || isReadonly}
                    >
                      {savingDay ? "Saving..." : "Save Day"}
                    </button>

                    {dayError && (
                      <p
                        className="error-text"
                        style={{ marginTop: 8 }}
                      >
                        {dayError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <b>Today</b>

                <div className="challenge-tiles grid-2">
                  <div className="challenge-tile wide">
                    <div className="tile-header">
                      <b>🥗 Nutrition</b>
                     <span
                      className="nutrition-view"
                      onClick={() =>
                        navigate("/form", { state: { date: dayToShow?.date, challengeDayId: dayToShow?._id}, })
                      }
                    >
                      View →
                    </span>




                    </div>

                    <NutritionDonut
                      consumedCalories={totalCalories}
                      targetCalories={calorieGoal}
                      protein={allMeals.reduce(
                        (sum, m) =>
                          sum + Number(m.protein || 0),
                        0
                      )}
                    />
                  </div>

                  <div className="challenge-tile challenge-tile-fixed">
                    <b>📖 Reading</b>
                    <input
                    className="challenge-input"
                    type="number"
                    value={dayReading}
                    disabled={isReadonly}
                    onChange={(e) => {
                      if (isReadonly) return;
                      const val = e.target.value;
                      setDayReading(val);
                      autoSaveDay({
                        readingPages:
                          val === ""
                            ? undefined
                            : Number(val),
                      });
                    }}
                  />

                  </div>

                  <div className="challenge-tile challenge-tile-fixed">
                    <b>💧 Water</b>
                    <input
                    className="challenge-input"
                    type="number"
                    value={dayWater}
                    disabled={isReadonly}
                    onChange={(e) => {
                      if (isReadonly) return;
                      const val = e.target.value;
                      setDayWater(val);
                      autoSaveDay({
                        waterLiters:
                          val === ""
                            ? undefined
                            : Number(val),
                      });
                    }}
                  />

                  </div>

                  <div className="challenge-tile">
                    <b>🏋️ Workout</b>

                    {workouts.length === 0 ? (
                      <p className="workout-empty">
                        No workouts yet.
                      </p>
                    ) : (
                      workouts.map((w) => (
                        <div
                          key={w._id}
                          className="food-item"
                        >
                          <div>
                            <strong>{w.type}</strong>
                            <p className="small-text">
                              {w.duration} min •{" "}
                              {w.calories} kcal
                            </p>
                          </div>

                          <div className="food-actions">
                            <button
                            disabled={isReadonly}
                            onClick={() => {
                              if (isReadonly) return;
                              setEditingWorkout(w);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            disabled={isReadonly}
                            onClick={() => {
                              if (isReadonly) return;
                              handleDeleteWorkout(w._id);
                            }}
                          >
                            ❌
                          </button>

                          </div>
                        </div>
                      ))
                    )}

                    <button
                    disabled={isReadonly}
                    onClick={() => {
                      if (isReadonly) return;
                      setShowWorkoutModal(true);
                    }}
                  >
                    + Add
                  </button>

                  </div>

                  <div className="challenge-tile challenge-tile-fixed">
                    <b>🚶 Steps</b>
                    <input
                    className="challenge-input"
                    type="number"
                    value={daySteps}
                    disabled={isReadonly}
                    onChange={(e) => {
                      if (isReadonly) return;
                      const val = e.target.value;
                      setDaySteps(val);
                      autoSaveDay({
                        steps:
                          val === ""
                            ? undefined
                            : Number(val),
                      });
                    }}
                  />

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
          onSuccess={() => loadWorkouts(dayToShow?._id)}

        />
      )}

      {showWorkoutModal && (
        <AddWorkoutModal
          onClose={() => setShowWorkoutModal(false)}
          onSuccess={() => loadWorkouts(dayToShow?._id)}


        />
      )}
    </div>
  );
}

export default ChallengePage;
