import { useState } from "react";
import bgImage from "../assets/images/chal.png";
import { saveChallenge } from "../services/challenge";

function ChallengePage() {
  // step: "select" | "custom"
  const [step, setStep] = useState("select");

  const [displayMode, setDisplayMode] = useState("daily");
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [workouts, setWorkouts] = useState("");
  const [error, setError] = useState("");

  const startPresetChallenge = async (type) => {
    try {
      await saveChallenge({ type });
      alert("Challenge started");
      // בהמשך נעבור ל־active
    } catch {
      alert("Failed to start challenge");
    }
  };

  const handleCustomSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await saveChallenge({
        type: "custom",
        displayMode,
        goals: {
          steps: steps ? Number(steps) : undefined,
          water: water ? Number(water) : undefined,
          workouts: workouts ? Number(workouts) : undefined,
        },
      });

      alert("Custom challenge saved");
      // בהמשך נעבור ל־active
    } catch {
      setError("Failed to save challenge");
    }
  };

  return (
    <div className="auth-bg" style={{ "--bg-image": `url(${bgImage})` }}>
      <div className="auth-box">

        {/* ================= SELECT CHALLENGE ================= */}
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
                style={{ marginTop: "14px" }}
                onClick={() => setStep("custom")}
              >
                Create Custom Challenge
              </button>
            </div>
          </>
        )}

        {/* ================= CUSTOM CHALLENGE ================= */}
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
                placeholder="Steps goal (optional)"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />

              <input
                type="number"
                placeholder="Water goal in liters (optional)"
                value={water}
                onChange={(e) => setWater(e.target.value)}
              />

              <input
                type="number"
                placeholder="Workouts goal (optional)"
                value={workouts}
                onChange={(e) => setWorkouts(e.target.value)}
              />

              {error && <p className="error-text">{error}</p>}

              <button type="submit">Save Challenge</button>

              <button
                type="button"
                style={{ background: "transparent", marginTop: "10px" }}
                onClick={() => setStep("select")}
              >
                ← Back
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default ChallengePage;
