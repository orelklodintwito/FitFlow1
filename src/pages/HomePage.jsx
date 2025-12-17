// src/pages/HomePage.jsx

import React, { useState } from "react";
import "../styles/homepage.css";
import "../styles/components.css";
import { useFavorites } from "../context/FavoritesContext.jsx";

function HomePage({ openFoodSearch, openManualFood }) {
  const challengeProgress = 57;

  const challengeTasks = [
    { id: 1, text: "Drink 2L Water", done: true },
    { id: 2, text: "10,000 Steps", done: false },
    { id: 3, text: "Eat 3 Healthy Meals", done: false },
  ];

  const { favorites, removeFavorite } = useFavorites();

  const motivation =
    challengeProgress < 50
      ? "Don't give up! You can do this 💪"
      : "You're almost there! Keep pushing 🚀";

  /* ============================== */
  /* BMI DATA */
  /* ============================== */
  const bmi = 21.7;
  const bmiMin = 15;
  const bmiMax = 35;
  const bmiPercent = Math.min(
    100,
    Math.max(0, ((bmi - bmiMin) / (bmiMax - bmiMin)) * 100)
  );

  /* ============================== */
  /* MEAL MODAL */
  /* ============================== */
  const [chosenMeal, setChosenMeal] = useState(null);

  const openCalorieModal = (meal) => setChosenMeal(meal);
  const closeCalorieModal = () => setChosenMeal(null);

  const handleManualAdd = () => {
    openManualFood(chosenMeal);
    closeCalorieModal();
  };

  const handleApiAdd = () => {
    openFoodSearch(chosenMeal);
    closeCalorieModal();
  };

  return (
    <div className="home-full-bg">
      <div className="dashboard">

        {/* ====================================================== */}
        {/* WEEKLY ACTIVITY */}
        {/* ====================================================== */}
        <div className="dashboard-card">
          <h2>Weekly Activity</h2>

          <div className="weekly-activity-chart">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              const height = [50, 90, 120, 30, 140, 100, 70][i];
              return (
                <div key={i} className="week-bar">
                  <div className="week-bar-inner">
                    <div
                      className="week-bar-fill"
                      style={{ height: `${height}px` }}
                    ></div>
                  </div>
                  <span className="week-bar-label">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================== */}
        {/* CHALLENGE */}
        {/* ====================================================== */}
        <div className="dashboard-card">
          <h2>Challenge</h2>

          <div className="challenge-flex">
            <div className="challenge-graph">
              <div
                className="circle-progress"
                style={{ "--percent": challengeProgress }}
              >
                <span className="circle-number">{challengeProgress}%</span>
              </div>
            </div>

            <div className="challenge-tasks">
              {challengeTasks.map((t) => (
                <div
                  key={t.id}
                  className={`challenge-item ${t.done ? "done" : ""}`}
                >
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          <p className="motivation-text">{motivation}</p>
        </div>

        {/* ====================================================== */}
        {/* DAILY CALORIES */}
        {/* ====================================================== */}
        <div className="dashboard-card calories-card">
          <h2>Daily Calories</h2>

          <div className="calories-header">
            <div className="cal-left">
              <p className="big-number">1200 Left</p>
              <p className="left-number">Consumed: 800 kcal</p>
            </div>

            <div className="cal-right">
              <div className="cal-progress">
                <div className="cal-fill" style={{ width: "40%" }}></div>
              </div>
            </div>
          </div>

          <div className="meal-row">
            <button
              className="btn-green"
              onClick={() => openCalorieModal("breakfast")}
            >
              Breakfast
            </button>
            <button
              className="btn-green"
              onClick={() => openCalorieModal("lunch")}
            >
              Lunch
            </button>
            <button
              className="btn-green"
              onClick={() => openCalorieModal("dinner")}
            >
              Dinner
            </button>
          </div>
        </div>

        {/* ====================================================== */}
        {/* SUMMARY + BMI */}
        {/* ====================================================== */}
        <div className="summary-bmi-row">
          <div className="dashboard-card summary-card">
            <h2>Today's Summary</h2>
            <p>✔ Drank 2L Water</p>
            <p>✔ Ate 3 Healthy Meals</p>
            <p>✔ Completed Steps Goal</p>
          </div>

          <div className="dashboard-card bmi-card">
            <h2>BMI</h2>

            <div className="bmi-progress-bar">
              <div className="bmi-zones">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>

              <div className="bmi-line">
                <div
                  className="bmi-marker"
                  style={{ left: `${bmiPercent}%` }}
                ></div>
              </div>

              <p className="bmi-value">{bmi}</p>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* ⭐ FAVORITES – CONTEXT REQUIRED SECTION */}
        {/* ====================================================== */}
        <div className="dashboard-card">
          <h2>My Favorites</h2>

          {favorites.length === 0 ? (
            <p>No favorites yet</p>
          ) : (
            <ul>
              {favorites.map((f) => (
                <li key={f.id} style={{ marginBottom: "8px" }}>
                  {f.name}
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => removeFavorite(f.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ====================================================== */}
        {/* MODAL FOR ADDING FOOD */}
        {/* ====================================================== */}
        {chosenMeal && (
          <div className="modal-overlay">
            <div className="modal-box small">
              <h2 className="modal-title">Add to {chosenMeal}</h2>
              <p className="modal-sub">Choose how to add:</p>

              <button className="option-btn" onClick={handleManualAdd}>
                Add Manually
              </button>

              <button className="option-btn" onClick={handleApiAdd}>
                Add via API
              </button>

              <button className="bottom-close" onClick={closeCalorieModal}>
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default HomePage;
