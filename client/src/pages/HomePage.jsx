// src/pages/HomePage.jsx
import React, { useState } from "react";
import "../styles/homepage.css";
import "../styles/components.css";

import { useFavorites } from "../context/FavoritesContext.jsx";

// ⭐ REDUX
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "../redux/themeSlice";

function HomePage({ meals, openFoodSearch, openManualFood }) {

  // ⭐ REDUX STATE
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  /* ============================== */
  /* CALCULATIONS FROM SERVER DATA */
  /* ============================== */
  const allMeals = Object.values(meals || {}).flat();

  const totalCalories = allMeals.reduce(
    (sum, meal) => sum + Number(meal.calories || 0),
    0
  );

  const totalProtein = allMeals.reduce(
    (sum, meal) => sum + Number(meal.protein || 0),
    0
  );

  const dailyGoal = 2000;
  const caloriesLeft = Math.max(dailyGoal - totalCalories, 0);
  const progressPercent = Math.min(
    100,
    Math.round((totalCalories / dailyGoal) * 100)
  );

  /* ============================== */
  /* CHALLENGE (STATIC – OK) */
  /* ============================== */
  const challengeProgress = 57;

  const challengeTasks = [
    { id: 1, text: "Drink 2L Water", done: true },
    { id: 2, text: "10,000 Steps", done: false },
    { id: 3, text: "Eat 3 Healthy Meals", done: false },
  ];

  // ⭐ CONTEXT
  const { favorites, removeFavorite } = useFavorites();

  const motivation =
    challengeProgress < 50
      ? "Don't give up! You can do this 💪"
      : "You're almost there! Keep pushing 🚀";

  /* ============================== */
  /* BMI DATA (STATIC – OK) */
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
    <div className={`home-full-bg ${mode}`}>
      <div className="dashboard">

        {/* ================= THEME ================= */}
        <div className="dashboard-card">
          <h2>Theme</h2>
          <button
            onClick={() => dispatch(toggleMode())}
            className="btn-green"
          >
            Switch to {mode === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* ================= WEEKLY ACTIVITY ================= */}
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

        {/* ================= CHALLENGE ================= */}
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

        {/* ================= DAILY CALORIES ================= */}
        <div className="dashboard-card calories-card">
          <h2>Daily Calories</h2>

          <div className="calories-header">
            <div className="cal-left">
              <p className="big-number">{caloriesLeft} Left</p>
              <p className="left-number">
                Consumed: {totalCalories} kcal
              </p>
              <p className="small-text">
                Protein: {totalProtein} g
              </p>
            </div>

            <div className="cal-right">
              <div className="cal-progress">
                <div
                  className="cal-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
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

        {/* ================= SUMMARY + BMI ================= */}
        <div className="summary-bmi-row">
          <div className="dashboard-card summary-card">
            <h2>Today's Summary</h2>
            <p>🍽 Meals logged: {allMeals.length}</p>
            <p>🔥 Calories consumed: {totalCalories}</p>
            <p>🥩 Protein: {totalProtein} g</p>
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

        {/* ================= FAVORITES ================= */}
        <div className="dashboard-card">
          <h2>My Favorites</h2>

          {favorites.length === 0 ? (
            <p>No favorites yet</p>
          ) : (
            <ul>
              {favorites.map((f) => (
                <li key={f.id}>
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

        {/* ================= MODAL ================= */}
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
